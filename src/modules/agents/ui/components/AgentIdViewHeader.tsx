import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronRightIcon, MoreVerticalIcon, PencilIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';

interface Props {
    agentId: string;
    agentName: string;
    onEdit: () => void;
    OnRemove: () => void;
}

const AgentIdViewHeader = ({
    agentId,
    agentName,
    onEdit,
    OnRemove,
}: Props) => {
    return (
        <div className='flex items-center justify-between'>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild className='font-medium text-xl'>
                            <Link href='/agents'>
                                My Agents
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className='text-foreground text-xl font-medium [&>svg]:size-4'>
                        <ChevronRightIcon />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <Link href={`/agents/${agentId}`} className='text-foreground text-xl font-medium'>
                            {agentName}
                        </Link>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger>
                    <Button variant='ghost'>
                        <MoreVerticalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={onEdit}>
                        <PencilIcon className='size-4 text-black' />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={OnRemove}>
                        <TrashIcon className='size-4 text-black' />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default AgentIdViewHeader; 
