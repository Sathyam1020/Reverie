'use client';
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import AgentIdFilter from "./AgentIdFilter";
import MeetingsSearchFilter from "./MeetingsSearchFilter";
import NewMeetingDialog from "./NewMeetingDialog";
import { StatusFilter } from "./StatusFilter";

export const MeetingsListHeader = () => {
    const [filters, setFilters] = useMeetingsFilters();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const isAnyFilterModified = !!filters.status || !!filters.search || !!filters.agentId;
    const onClearFilters = () => {
        setFilters({
            search: "",
            status: null,
            agentId: "",
            page: 1,
        })
    }

    return (
        <>
            <NewMeetingDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
            <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4 ">
                <div className="flex items-center justify-between">
                    <h5 className="font-medium text-xl">My Meetings</h5>
                    <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-x-2">
                        <PlusIcon />
                        New Meeting
                    </Button>
                </div>
                <ScrollArea>
                    <div className="flex items-center gap-x-2 p-1">
                        <MeetingsSearchFilter />
                        <StatusFilter />
                        <AgentIdFilter />
                        {
                            isAnyFilterModified && (
                                <Button
                                    variant='outline'
                                    onClick={onClearFilters}
                                >
                                    <XCircleIcon className="size-4" />
                                    Clear
                                </Button>
                            )
                        }
                    </div>
                    <ScrollBar orientation="horizontal"/>
                </ScrollArea>
            </div>
        </>
    )
} 