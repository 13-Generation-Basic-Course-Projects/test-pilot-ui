import { FileIcon, HistoryIcon, HomeIcon, InboxIcon } from "lucide-react";

export const Projects = [{}];

export const SidebarMenu = {
	navMain: [
		{
			title: "Project",
			path: "/",
			icon: HomeIcon,
		},
		{
			title: "Collection",
			path: "collection",
			icon: FileIcon,
		},
		{
			title: "History",
			path: "history",
			icon: HistoryIcon,
		},
		{
			title: "Project Variables",
			path: "project-variables",
			icon: InboxIcon,
		},
	],
};
