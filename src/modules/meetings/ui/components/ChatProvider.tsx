'use client'; 

import { authClient } from "@/lib/auth-client";
import LoadingState  from "@/components/loading-state"; 

interface Props {
    meetingId: string; 
    meetingName: string; 
}

import React from 'react'
import ChatUI from "./ChatUI";

const ChatProvider = ({
    meetingId,
    meetingName,
}: Props ) => {

    const { data, isPending } = authClient.useSession();

    if( isPending || !data?.user ) {
        return (
            <LoadingState
                title="Loading..."
                description="Please wait while we lead the chat."
            />
        )
    }

  return (
    <div>
      <ChatUI
        meetingId={meetingId}
        meetingName={meetingName}
        userId={data.user.id}
        userName={data.user.name || data.user.email || "Anonymous"}
        userImage={data.user.image || ""}
      />
    </div>
  )
}

export default ChatProvider; 

