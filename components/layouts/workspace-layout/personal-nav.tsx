"use client"

import {
    IconCircleDashed
} from "@tabler/icons-react"

import {SpaceListContainer} from "./space-list-container"
import EachSpaceNavItem from "@/components/layouts/workspace-layout/each-space-nav-item";

export function PersonalNav() {


    return (
        <SpaceListContainer header="Personal" canCreate>
            <EachSpaceNavItem
                Icon={IconCircleDashed}
                label="My Space"
                href="£"
            />
            <EachSpaceNavItem
                Icon={IconCircleDashed}
                label="Project Alpha"
                href="£"
            />
        </SpaceListContainer>
    )
}
