'use client';

import ErrorState from '@/components/ErrorState';
import LoadingState from '@/components/loading-state';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

const MeetingsView = () => {

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(
        trpc.meetings.getMany.queryOptions({})
    );

    return (
        <div>
            {JSON.stringify(data, null, 2)}
        </div>
    )
}

export default MeetingsView;

export const MeetingsViewLoading = () => {
    return (
        <LoadingState title='Loading Meetings' description='This may take a few seconds...' />
    )
}

export const MeetingsViewError = () => {
    return (
        <ErrorState
            title="Error loading meetings"
            description="There was an error loading the meetings. Please try again later."
        />
    )
}