"use client"

import {
    IconHome,
    IconBell,
    IconUsers,
    IconTrash,
    type Icon,
    IconCalendar
} from "@tabler/icons-react"

import {Button} from "@/components/ui/button"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {usePathname} from "next/navigation";
import Link from "next/link";

export function NavMain() {
    const pathname = usePathname();
    const items = [
        {
            title: "Home",
            url: "/",
            icon: IconHome,
            isActive: pathname === "/"
        },
        {
            title: "Notifications",
            url: "/notifications",
            icon: IconBell,
            isActive: pathname.includes('/notifications')
        },
        {
            title: "People",
            url: "/people",
            icon: IconUsers,
            isActive: pathname.includes('/people')
        },
        {
            title: 'Calendar',
            url: '/calendar',
            isActive: pathname.includes('/calendar'),
            icon: IconCalendar,
        },
        {
            title: "Trash",
            url: "/trash",
            isActive: pathname.includes('/trash'),
            icon: IconTrash,
        },
    ]
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton tooltip={item.title} isActive={item.isActive} asChild>
                                <Link href={item.url}>
                                    {item.icon && <item.icon/>}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
