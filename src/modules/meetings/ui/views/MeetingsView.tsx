'use client';

import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import LoadingState from '@/components/loading-state';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMeetingsFilters } from '../../hooks/use-meetings-filters';
import { columns } from '../components/Columns';
import { DataTable } from '../components/DataTable';
import DataPagination from '../components/DataPagination';
import { useRouter } from 'next/navigation';

const MeetingsView = () => {

    const trpc = useTRPC();
    const [filters, setFilters] = useMeetingsFilters();
    const safeFilters = {
        ...filters,
        status: filters.status ?? undefined,
        agentId: filters.agentId || undefined,  // if empty string, convert to undefined
    };

    const { data } = useSuspenseQuery(
        trpc.meetings.getMany.queryOptions(safeFilters)
    );

    const router = useRouter(); 

    return (
        <div className='flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4'>
            <DataTable
                data={data.items}
                columns={columns}
                onRowClick={(row) => router.push(`/meetings/${row.id}`)}
            />
            <DataPagination
                page={filters.page}
                totalPages={data.totalPages}
                onPageChange={(page) => setFilters({ page })}
            />
            {data.items.length === 0 && (
                <EmptyState
                    title="Create your first meeting"
                    description="Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas, and interact with participants in real time."
                />
            )}
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