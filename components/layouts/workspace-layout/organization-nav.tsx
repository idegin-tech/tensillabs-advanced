"use client"

import {
    IconCircleDashed,
} from "@tabler/icons-react"

import { SpaceListContainer } from "./space-list-container"
import EachSpaceNavItem from "@/components/layouts/workspace-layout/each-space-nav-item";

export function OrganizationNav() {
    return (
        <SpaceListContainer header="Organization" canCreate={false}>
            <EachSpaceNavItem
                Icon={IconCircleDashed}
                label="Human Resources"
                href="£"
            />
        </SpaceListContainer>

    )
}
