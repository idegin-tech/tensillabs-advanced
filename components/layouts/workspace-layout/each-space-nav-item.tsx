import React from 'react'
import {SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, useSidebar} from "@/components/ui/sidebar";
import {IconDots, IconFolder, IconShare3, IconTableColumn, IconTrash} from "@tabler/icons-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

type Props = {
    label: string;
    href: string;
    onClick?: () => void;
    isActive?: boolean;
    Icon: any;
}

export default function EachSpaceNavItem(
    {
        label,
        href,
        onClick,
        isActive,
        Icon
    }: Props) {
    const {isMobile} = useSidebar()
    return (
        <>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive} onClick={onClick}>
                    <div>
                        <Icon/>
                        <Link href={href} onClick={onClick}>
                            <span>{label}</span>
                        </Link>
                    </div>
                </SidebarMenuButton>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuAction
                            showOnHover
                            className="data-[state=open]:bg-accent rounded-sm"
                        >
                            <IconDots/>
                            <span className="sr-only">More</span>
                        </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-24 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align={isMobile ? "end" : "start"}
                    >
                        <DropdownMenuItem>
                            <IconFolder/>
                            <span>Open</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <IconShare3/>
                            <span>Share</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem variant="destructive">
                            <IconTrash/>
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </>
    )
}