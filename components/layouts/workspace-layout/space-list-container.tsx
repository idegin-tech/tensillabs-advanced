"use client"

import {
    IconPlus,
} from "@tabler/icons-react"

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button";

export function SpaceListContainer({ header, children, canCreate }: {
    header: string;
    children: React.ReactNode;
    canCreate?: boolean;
}) {
    const { isMobile } = useSidebar()

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>
                {header}
                {canCreate && (<Button size={'icon'} variant="ghost" disabled={!canCreate} className="ml-auto p-0.5 data-[state=open]:bg-accent rounded-sm">
                    <IconPlus />
                </Button>)}
            </SidebarGroupLabel>
            <SidebarMenu>
                {children}
            </SidebarMenu>
        </SidebarGroup>
    )
}
