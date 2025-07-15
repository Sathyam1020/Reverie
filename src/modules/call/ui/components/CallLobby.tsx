import {
    DefaultVideoPlaceholder,
    StreamVideoParticipant,
    ToggleAudioPreviewButton,
    ToggleVideoPreviewButton,
    useCallStateHooks,
    VideoPreview,
} from "@stream-io/video-react-sdk";
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { generateAvatarUri } from '@/lib/avatar';
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { LogInIcon } from "lucide-react";

interface Props {
    onJoin: () => void;
}

const DisabledVideoPreview = () => {
    const { data } = authClient.useSession();
    return (
        <DefaultVideoPlaceholder
            participant={
                {
                    name: data?.user.name ?? "Guest",
                    image: data?.user.image ?? generateAvatarUri({
                        seed: data?.user.name || "Guest",
                        variant: "initials"
                    })
                } as StreamVideoParticipant
            }
        />
    ); 
}

const AllowBrowserPermissions = () => {
    return (
        <div className='text-sm'>
            Please grant your browser a permission to access your camera and microphone
        </div>
    )
}

const CallLobby = ({ onJoin }: Props) => {
    const { useCameraState, useMicrophoneState } = useCallStateHooks();
    const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
    const { hasBrowserPermission: hasCameraPermission } = useCameraState();
    const hasBroswerMediaPermission = hasMicPermission && hasCameraPermission;
    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-radial from-sidebar-accent to-sidebar'>
            <div className="py-4 px-8 flex flex-1 items-center justify-center">
                <div className='flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm'>
                    <div className='flex flex-col gap-y-2 text-center'>
                        <h6 className='text-lg font-medium'>Ready to join?</h6>
                        <p className='text-sm'>Set up your call before joining</p>
                    </div>
                    <VideoPreview
                        DisabledVideoPreview={
                            hasBroswerMediaPermission ? DisabledVideoPreview : AllowBrowserPermissions
                        }
                    />
                    <div className='flex gap-x-2'>
                        <ToggleAudioPreviewButton />
                        <ToggleVideoPreviewButton />
                    </div>
                    <div className='flex gap-x-2 justify-between w-full'>
                        <Button asChild variant='ghost'>
                            <Link
                                href={`/meetings`}
                            >
                                Cancel
                            </Link>
                        </Button>
                        <Button onClick={onJoin}>
                            <LogInIcon />
                            Join Meeting
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CallLobby;  