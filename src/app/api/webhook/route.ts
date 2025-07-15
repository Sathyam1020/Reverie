import {
    CallEndedEvent,
    CallRecordingReadyEvent,
    CallSessionParticipantLeftEvent,
    CallSessionStartedEvent,
    CallTranscriptionReadyEvent,
} from '@stream-io/node-sdk'; 

import { db } from '@/db';
import {agents, meetings} from '@/db/schema';
import { streamVideo } from '@/lib/stream-video';
import { NextRequest, NextResponse } from 'next/server';
import { and, eq, not } from 'drizzle-orm';
import { inngest } from '@/inngest/client';
// import { Call } from '@stream-io/video-react-sdk';
// import { NextRequest, NextResponse } from 'next/server';

function verifySignatureWithSDK(body: string, signature: string): boolean {
    return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req:NextRequest){
    const signature = req.headers.get("x-signature"); 
    const apiKey = req.headers.get("x-api-key");

    if(!signature || !apiKey) {
        return new Response("Missing signature or API key", { status: 400 });
    }

    const body = await req.text();

    if(!verifySignatureWithSDK(body, signature)){
        return NextResponse.json(
            {error: "Missing signature or API key"},
            { status: 400 }
        ); 
    }; 
    let payload: unknown;
    try{
        payload = JSON.parse(body) as Record<string, unknown>;
    } catch {
        return NextResponse.json(
            {error: "Invalid JSON payload"},
            { status: 400 }
        );
    }

    const eventType = (payload as Record<string, unknown>)?.type;

    if(eventType === "call.session_started"){
        const event = payload as CallSessionStartedEvent;
        const meetingID = event.call.custom?.meetingId; 

        if(!meetingID){
            return NextResponse.json(
                {error: "Missing meeting ID in call session started event"},
                { status: 400 }
            );
        }

        const [exisitingMeeting]  = await db
            .select()
            .from(meetings)
            .where(
                and(
                    eq(meetings.id, meetingID),
                    not(eq(meetings.status, "active")),
                    not(eq(meetings.status, "completed")),
                    not(eq(meetings.status, "cancelled")),
                    not(eq(meetings.status, "processing"))
                )
            )
        if(!exisitingMeeting){
            return NextResponse.json(
                {error: "Meeting not found or already active"},
                { status: 404 }
            );
        }  
        
        await db
            .update(meetings)
            .set({
                status: "active",
                startedAt: new Date(),
            })
            .where(eq(meetings.id, meetingID));

        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, exisitingMeeting.agentId));  
        
        if(!existingAgent){
            return NextResponse.json(
                {error: "Agent not found"},
                { status: 404 }
            );
        }

        const call = streamVideo.video.call("default", meetingID); 

        const realtimeClient = await streamVideo.video.connectOpenAi({
            call,
            openAiApiKey: process.env.OPENAI_API_KEY!,
            agentUserId: existingAgent.id
        });  

        realtimeClient.updateSession({
            instructions: existingAgent.instructions,
        })
    } else if ( eventType === "call.sessoin_participant_left") {
        const event = payload as CallSessionParticipantLeftEvent;
        const meetingID = event.call_cid.split(":")[1];

        if(!meetingID){
            return NextResponse.json(
                {error: "Missing meeting ID in call session participant left event"},
                { status: 400 }
            );
        }

        const call = streamVideo.video.call("default", meetingID);
        await call.end(); 
    } else if ( eventType === "call.session_ended") {
        const event = payload as CallEndedEvent;
        const meetingID = event.call.custom?.meetingId; 
        if(!meetingID){
            return NextResponse.json(
                {error: "Missing meeting ID in call session ended event"},
                { status: 400 }
            );
        }

        await db
            .update(meetings)   
            .set({
                status: "processing",
                endedAt: new Date()
            })
            .where(
                and(
                    eq(meetings.id, meetingID),
                    eq(meetings.status, "active")
                )
            )
    } else if ( eventType === "call.transcription_ready") {
        const event = payload as CallTranscriptionReadyEvent; 
        const meetingId = event.call_cid.split(":")[1];
        console.log(event.call_transcription.url); 
        const [updatedMeeting] = await db
            .update(meetings)
            .set({
                transcriptUrl: event.call_transcription.url,
            })
            .where(eq(meetings.id, meetingId))
            .returning();

        if(!updatedMeeting){
            return NextResponse.json(
                {error: "Meeting not found"},
                { status: 404 }
            );
        }    

        await inngest.send({
            name: "meetings/processing",
            data: {
                meetingId: updatedMeeting.id,
                transcriptUrl: updatedMeeting.transcriptUrl 
            }
        })
    } else if ( eventType === "call.recording_ready") {
        const event = payload as CallRecordingReadyEvent
        const meetingId = event.call_cid.split(":")[1];

        await db
            .update(meetings)
            .set({
                recordingUrl: event.call_recording.url,
            })
            .where(eq(meetings.id, meetingId))
    }


    return NextResponse.json({
        status: "ok",
    })

}