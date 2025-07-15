'use client';

import { Call, CallingState, StreamCall, StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk';
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useMutation } from '@tanstack/react-query';
import { LoaderIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import CallUI from './CallUI';
import { useTRPC } from '@/trpc/client';

interface Props {
    meetingId: string;
    meetingName: string;
    userId: string;
    userName: string;
    userImage: string;
}

const CallConnect = ({
    meetingId,
    meetingName,
    userId,
    userName,
    userImage,
}: Props) => {

    const trpc = useTRPC();
    const { mutateAsync: generateToken } = useMutation(
        trpc.meetings.generateToken.mutationOptions()
    )

    const [client, setClient] = useState<StreamVideoClient>();
    const [call, setCall] = useState<Call>();
    useEffect(() => {
        const _client = new StreamVideoClient({
            apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
            user: {
                id: userId,
                name: userName,
                image: userImage,
            },
            tokenProvider: generateToken,
        });
        setClient(_client);
        return () => {
            _client.disconnectUser();
            setClient(undefined);
        }
    }, [userId, userName, userImage, generateToken]);

    useEffect(() => {
        if (!client) return;
        const _call = client.call("default", meetingId);
        _call.microphone.disable();
        _call.camera.disable();
        setCall(_call);
        return () => {
            if (_call.state.callingState !== CallingState.LEFT) {
                _call.leave();
                _call.endCall();
                setCall(undefined);
            }
        }
    }, [client, meetingId]);

    if (!client || !call) {
        return (
            <div className='flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar'>
                <LoaderIcon className='size-6 animate-spin text-white' />
            </div>
        )
    }

    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <CallUI 
                    meetingName={meetingName}
                />
            </StreamCall>
        </StreamVideo>
    )
}

export default CallConnect; 
