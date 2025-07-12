'use client';
import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from '../../../../../public/icons/mainLogo.svg';
import DashboardUserButton from "./DashboardUserButton";

const firstSection = [
    {
        icon: VideoIcon,
        label: 'Meetings',
        href: '/meetings',
    },
    {
        icon: BotIcon,
        label: 'Agents',
        href: '/agents',
    }
];

const secondSection = [
    {
        icon: StarIcon,
        label: 'Upgrade',
        href: '/upgrade',
    }
];

export const DashboardSidebar = () => {

    const pathname = usePathname();

    return (
        <div>
            <Sidebar>
                <SidebarHeader className="text-sidebar-accent-foreground">
                    <Link href='/' className="flex items-center gap-2 px-2 pt-2">
                        <Image src={Logo} height={36} width={36} alt="Reverie" />
                        <p className="text-2xl font-semibold">Reverie</p>
                    </Link>
                </SidebarHeader>
                <div className="px-4 py-2">
                    <Separator className="opacity-10 text-[#5d6b68]" />
                </div>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {
                                    firstSection.map((item) => (
                                        <SidebarMenuItem
                                            key={item.label}
                                        >
                                            <SidebarMenuButton
                                                asChild
                                                className={cn(
                                                    "group relative h-10 px-4 flex items-center gap-3 rounded-md font-medium text-sm transition-colors duration-200",
                                                    pathname === item.href
                                                        ? "bg-[#0ba5e9]/10 text-[#0ba5e9] before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1 before:rounded-r-md before:bg-[#0ba5e9]"
                                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                                )}
                                                isActive={pathname === item.href}
                                            >
                                                <Link
                                                    href={item.href}
                                                >
                                                    <item.icon className="h-5 w-5" />
                                                    <span className="text-sm font-medium tracking-tight">
                                                        {item.label}
                                                    </span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))
                                }
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    {/* Divider  */}
                    <div className="px-4 py-2">
                        <Separator className="opacity-10 text-[#5d6b68]" />
                    </div>
                    {/* Second section  */}
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {
                                    secondSection.map((item) => (
                                        <SidebarMenuItem
                                            key={item.label}
                                        >
                                            <SidebarMenuButton
                                                asChild
                                                className={cn(
                                                    "group relative h-10 px-4 flex items-center gap-3 rounded-md font-medium text-sm transition-colors duration-200",
                                                    pathname === item.href
                                                        ? "bg-[#0ba5e9]/10 text-[#0ba5e9] before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1 before:rounded-r-md before:bg-[#0ba5e9]"
                                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                                )}
                                                isActive={pathname === item.href}
                                            >
                                                <Link
                                                    href={item.href}
                                                >
                                                    <item.icon className="h-5 w-5" />
                                                    <span className="text-sm font-medium tracking-tight">
                                                        {item.label}
                                                    </span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))
                                }
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter className="text-white/">
                    <DashboardUserButton />
                </SidebarFooter>
            </Sidebar>
        </div>
    )
}