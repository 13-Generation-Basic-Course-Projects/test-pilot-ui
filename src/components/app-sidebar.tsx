"use client";

import * as React from "react";

import { SideMain } from "@/components/nav-main";

import { sidebarMenus } from "@/lib/constants";

import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import Logo from "./icons/logo";
import { useState } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader className={isOpen ? "mt-[3px]" : "mt-[7.5px]"}>
				<div className="flex items-center justify-between">
					{isOpen && <Logo />}
					<SidebarTrigger onClick={() => setIsOpen((prev) => !prev)} />
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SideMain items={sidebarMenus.sideMenu} />
			</SidebarContent>
		</Sidebar>
	);
}
