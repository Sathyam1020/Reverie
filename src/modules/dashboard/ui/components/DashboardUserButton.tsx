import { GeneratedAvatar } from '@/components/generated-avatar';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { authClient } from '@/lib/auth-client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const DashboardUserButton = () => {
    const router = useRouter();
    const { data, isPending } = authClient.useSession();;

    if (isPending || !data?.user) {
        return null;
    }

    const onLogout = async () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/sign-in')
                }
            }
        });
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger className='rounded-lg border border-border-/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden transition-all duration-200 cursor-pointer'>
                    {
                        data.user.image ? (
                            <div>
                                <Avatar>
                                    <AvatarImage src={data.user.image} />
                                </Avatar>
                            </div>
                        ) : (
                            <GeneratedAvatar
                                seed={data.user.name}
                                variant='initials'
                                className='size-9 mr-3'
                            />
                        )
                    }
                    <div className='flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0'>
                        <p className='text-sm truncate w-full'>
                            {data.user.name}
                        </p>
                        <p className='text-xs truncate w-full'>
                            {data.user.email}
                        </p>
                    </div>
                    <ChevronDownIcon className='size-4 shrink-0' />
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' side='right' className='w-72  bg-white rounded-lg shadow-lg p-2 ml-1'>
                    <DropdownMenuLabel asChild>
                        <div className='flex flex-col gap-1'>
                            <span className='font-medium truncate text-black'>{data.user.name}</span>
                            <span className='text-sm font-normal text-muted-foreground truncate'>{data.user.email}</span>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-2 h-px bg-muted" />
                    <DropdownMenuItem
                        className="group cursor-pointer flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground
    transition-colors duration-200 hover:bg-[#f1f5f9] hover:text-black 
    outline-none ring-0 focus:ring-0 focus-visible:ring-0 border-0"
                    >
                        <span className="transition-all duration-200 group-hover:translate-x-1">Billing</span>
                        <CreditCardIcon className="size-4 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={onLogout}
                        className="group cursor-pointer flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground
    transition-colors duration-200 hover:bg-[#fee2e2] hover:text-red-600 
    outline-none ring-0 focus:ring-0 focus-visible:ring-0 border-0"
                    >
                        <span className="transition-all duration-200 group-hover:translate-x-1">Logout</span>
                        <LogOutIcon className="size-4 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default DashboardUserButton
