"use client";

import { type LucideIcon } from "lucide-react";

import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useProjectPath } from "@/hooks/use-project-path";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		path: string;
		icon?: LucideIcon;
	}[];
}) {
	const { subpathSegments } = useProjectPath();
	const pathname = usePathname();

	const projectId =
		subpathSegments && subpathSegments.length > 0 ? subpathSegments[0] : null;

	return (
		<SidebarGroup>
			<SidebarMenu>
				{items.map((item) => {
					const Href =
						item.path === "/"
							? "/project"
							: projectId
							? item.path === "collection"
								? `/project/${projectId}`
								: `/project/${projectId}/${item.path}`
							: "#";

					const isActive = Href !== "#" && pathname === Href;

					return (
						<Collapsible
							key={item.title}
							asChild
							className="group/collapsible my-2 rounded-lg"
							defaultOpen={isActive && Href !== "/project"}
						>
							<SidebarMenuItem
								className={cn({ "bg-muted font-semibold": isActive })}
							>
								<CollapsibleTrigger asChild>
									<Link href={Href} className="cursor-pointer">
										<SidebarMenuButton tooltip={item.title}>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
										</SidebarMenuButton>
									</Link>
								</CollapsibleTrigger>
							</SidebarMenuItem>
						</Collapsible>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
