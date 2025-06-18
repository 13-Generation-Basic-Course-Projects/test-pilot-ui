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

export function SideMain({
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

	// --- Start of new logic ---

	// 1. Pre-calculate all possible Hrefs from the items array.
	const validHrefs = items
		.map((item) => {
			if (item.path === "/") {
				return "/project";
			}
			if (!projectId) {
				return "#"; // Mark as invalid if no project ID
			}
			return item.path === "collection"
				? `/project/${projectId}`
				: `/project/${projectId}/${item.path}`;
		})
		.filter((href) => href !== "#");

	// 2. Find all Hrefs that are a prefix of the current pathname.
	const matchingHrefs = validHrefs.filter((href) => pathname.startsWith(href));

	// 3. From the matches, find the one with the longest length. This is our active link.
	const activeHref = matchingHrefs.reduce(
		(longest, current) => (current.length > longest.length ? current : longest),
		""
	);

	// --- End of new logic ---

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

					const isActive = Href === activeHref;

					return (
						<Collapsible
							key={item.title}
							asChild
							className="group/collapsible my-2 rounded-lg"
							defaultOpen={isActive && Href !== "/project"}
						>
							<SidebarMenuItem
								className={cn({
									"bg-muted font-semibold": isActive,
								})}
							>
								<CollapsibleTrigger asChild>
									<Link href={Href}>
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
