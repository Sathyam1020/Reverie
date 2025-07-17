import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MAX_FREE_AGENTS, MAX_FREE_MEETINGS } from '@/modules/premium/constants';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { RocketIcon } from 'lucide-react';
import Link from 'next/link';

const DashboardTrial = () => {
    const trpc = useTRPC();

    const { data } = useQuery(trpc.premium.getFreeUsage.queryOptions());

    if (!data) return null;

    return (
        <div className='rounded-lg border border-border/10 w-full flex flex-col bg-white/5 overflow-hidden transition-all duration-200 cursor-pointer gap-y-2 mb-2 hover:shadow-md hover:scale-[1.01]'>
            <div className='p-3 flex flex-col gap-y-4'>
                <div className='flex items-center gap-2'>
                    <RocketIcon className='size-4 transition-transform duration-300 group-hover:rotate-12' />
                    <p className='text-sm font-medium'>Free Trial</p>
                </div>

                <div className='flex flex-col gap-y-2'>
                    <div className='text-xs transition-opacity duration-500 opacity-90 hover:opacity-100'>
                        {data.agentCount}/{MAX_FREE_AGENTS} Agents
                    </div>
                    <Progress
                        value={(data.agentCount / MAX_FREE_AGENTS) * 100}
                        className='transition-all duration-500 ease-in-out'
                    />
                </div>

                <div className='flex flex-col gap-y-2'>
                    <div className='text-xs transition-opacity duration-500 opacity-90 hover:opacity-100'>
                        {data.meetingCount}/{MAX_FREE_MEETINGS} Meetings
                    </div>
                    <Progress
                        value={(data.meetingCount / MAX_FREE_MEETINGS) * 100}
                        className='transition-all duration-500 ease-in-out'
                    />
                </div>
            </div>

            <Button
                asChild
                className='bg-transparent border-t border-border/10 hover:bg-white/10 rounded-t-none transition-colors duration-300'
            >
                <Link href='/upgrade' className='w-full text-sm transition-transform duration-300 hover:scale-[1.02]'>
                    Upgrade
                </Link>
            </Button>
        </div>
    );
};

export default DashboardTrial;
