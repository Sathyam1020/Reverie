import { GeneratedAvatar } from '@/components/generated-avatar';
import { CommandEmpty, CommandGroup, CommandItem, CommandList, CommandResponsiveDialog } from '@/components/ui/command';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { CommandInput } from 'cmdk';
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from 'react';
interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const DashboardCommand = ({ open, setOpen }: Props) => {

  const router = useRouter();
  const [search, setSearch] = useState("");

  const trpc = useTRPC();
  const meetings = useQuery(
    trpc.meetings.getMany.queryOptions({
      search,
      pageSize: 100
    })
  );
  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      search,
      pageSize: 100
    })
  );

  return (
    <div>
      <CommandResponsiveDialog shouldFilter={false} open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder='Find a meeting or agent...'
          className='p-3'
          onValueChange={(value) => setSearch(value)}
        />
        <CommandList>
          <CommandGroup heading='Meetings'>
            <CommandEmpty className='text-muted-foreground text-sm'>
              No meetings found.
            </CommandEmpty>
            {
              meetings.data?.items.map((meeting) => (
                <CommandItem
                  onSelect={() => {
                    router.push(`/meetings/${meeting.id}`)
                    setOpen(false);
                  }}
                  key={meeting.id}
                >
                  {meeting.name}
                </CommandItem>
              ))
            }
          </CommandGroup>
          <CommandGroup heading='Agents'>
            <CommandEmpty className='text-muted-foreground text-sm'>
              No agents found.
            </CommandEmpty>
            {
              agents.data?.items.map((agent) => (
                <CommandItem
                  onSelect={() => {
                    router.push(`/agents/${agent.id}`)
                    setOpen(false);
                  }}
                  key={agent.id}
                >
                  <GeneratedAvatar
                    variant='botttsNeutral'
                    seed={agent.name}
                    className='size-5'
                  />
                  {agent.name}
                </CommandItem>
              ))
            }
          </CommandGroup>
        </CommandList>
      </CommandResponsiveDialog>
    </div>
  )
}

export default DashboardCommand; 
