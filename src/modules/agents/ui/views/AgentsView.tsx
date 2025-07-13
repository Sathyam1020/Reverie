'use client'

import ErrorState from "@/components/ErrorState";
import LoadingState from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "../components/DataTable";
import { columns } from "../components/Columns";
import EmptyState from "@/components/EmptyState";
import { useAgentsFilters } from "../../hooks/use-agents-filter";
import DataPagination from "../components/DataPagination";

const AgentsView = () => {

    const [filters, setFilters] = useAgentsFilters(); 

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filters 
    }));

    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable data={data.items} columns={columns}/>
            <DataPagination
                page={filters.page}
                totalPages={data.totalPages}
                onPageChange={(page) => setFilters({page})}
            />
            {data.items.length === 0 && (
                <EmptyState
                    title="Create your first agent"
                    description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call."
                />
            )}
        </div>
    );
}

export default AgentsView;

export const AgentsViewLoading = () => {
    return (
        <LoadingState title='Loading Agents' description='This may take a few seconds...' />
    )
}

export const AgentsViewError = () => {
    return (
        <ErrorState
            title="Error loading agents"
            description="There was an error loading the agents. Please try again later."
        />
    )
}