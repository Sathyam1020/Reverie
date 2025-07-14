'use client';

import ErrorState from '@/components/ErrorState';
import LoadingState from '@/components/loading-state';
import { useConfirm } from '@/modules/agents/hooks/use-confirm';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import MeetingIdViewHeader from '../components/MeetingIdViewHeader';
import UpdateMeetingDialog from '../components/UpdateMeetingDialog';
import { useState } from 'react';

interface Props {
    meetingId: string;
}

const MeetingIdView = ({ meetingId }: Props) => {

    const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({
            id: meetingId,
        })
    )

    const queryClient = useQueryClient();
    const router = useRouter();

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you sure? ",
        "The following action will remove this meeting permanently.",
    )

    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: async () => {
                queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                )
                router.push('/meetings');
            },
            onError: (error) => {
                toast.error(error.message);
            },
        })
    );

    const handleRemoveMeeting = async () => {
        const ok = await confirmRemove();
        if (!ok) return;
        removeMeeting.mutate({
            id: meetingId,
        });
    }

    return (
        <div>
            <RemoveConfirmation />
            <UpdateMeetingDialog
                open={updateMeetingDialogOpen}
                onOpenChange={setUpdateMeetingDialogOpen}
                initialValues={data}
            />
            <div className='flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4'>
                <MeetingIdViewHeader
                    meetingId={meetingId}
                    meetingName={data.name}
                    onEdit={() => setUpdateMeetingDialogOpen(true)}
                    OnRemove={handleRemoveMeeting}
                />
                {JSON.stringify(data, null, 2)}
            </div>
        </div>
    )
}

export default MeetingIdView;

export const MeetingIdViewLoading = () => {
    return (
        <LoadingState title='Loading Meeting' description='This may take a few seconds...' />
    )
}

export const MeetingIdViewError = () => {
    return (
        <ErrorState
            title="Error loading meeting"
            description="There was an error loading the meeting. Please try again later."
        />
    )
}
