"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";

import { SidebarMenu } from "@/lib/constants";

import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import Logo from "./icons/logo";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const [isOpen, setIsOpen] = React.useState(true);

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader className={isOpen ? "mt-[3px]" : "mt-[7.5px]"}>
				<div className="flex items-center  justify-between">
					{isOpen && <Logo />}
					<SidebarTrigger onClick={() => setIsOpen((prev) => !prev)} />
				</div>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={SidebarMenu.navMain} />
			</SidebarContent>
			{/* <SidebarRail /> */}
		</Sidebar>
	);
}
