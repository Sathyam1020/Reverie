import React, { useState } from 'react'
import { StreamTheme, useCall } from '@stream-io/video-react-sdk';
import CallLobby from './CallLobby';
import CallActive from './CallActive';
import CallEnded from './CallEnded';

interface Props {
    meetingName: string; 
}
const CallUI = ({meetingName}: Props) => {

    const call = useCall(); 
    const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby"); 

    const handleJoin = async() => {
        if(!call) return; 
        await call.join(); 
        setShow("call");
    }

    const handleLeave = () => {
        if(!call) return; 
        call.leave(); 
        setShow("ended");
    }
  return (
    <StreamTheme className='h-full '>
      {show === "lobby" && <CallLobby onJoin={handleJoin}/>}
      {show === "call" && <CallActive
        meetingName={meetingName}
        onLeave={handleLeave}
      />}
      {show === "ended" && <CallEnded />}
    </StreamTheme>
  )
}

export default CallUI; 