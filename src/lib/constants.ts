import { FileIcon, HistoryIcon, HomeIcon, InboxIcon } from "lucide-react";

export const projectsData = [
	{
		id: "tp_001",
		iconType: "folder",
		title: "Test Pilot Core APIs",
		description:
			"Main collection for testing the Test Pilot application's essential API functionalities.",
		creationDate: "24 April, 2025",
		userAvatarUrl: "https://i.pravatar.cc/40?u=user1",
	},
	{
		id: "tp_002",
		iconType: "folder",
		title: "User Authentication Suite",
		description:
			"Validating login, registration, password reset, and token management.",
		creationDate: "15 May, 2025",
		userAvatarUrl: "https://i.pravatar.cc/40?u=user2",
	},
	{
		id: "tp_003",
		iconType: "folder",
		title: "E-commerce Product Endpoints",
		description:
			"Tests for product listing, details, search, and inventory updates.",
		creationDate: "02 January, 2025",
		userAvatarUrl: "https://i.pravatar.cc/40?u=user3",
	},
	{
		id: "tp_004",
		iconType: "folder",
		title: "Payment Gateway Integration",
		description:
			"Verifying payment processing, refunds, and subscription lifecycle.",
		creationDate: "18 March, 2025",
		userAvatarUrl: "https://i.pravatar.cc/40?u=user4",
	},
	{
		id: "tp_005",
		iconType: "folder",
		title: "Notification Service Checks",
		description:
			"Ensuring email, SMS, and push notifications are functioning correctly.",
		creationDate: "28 February, 2025",
		userAvatarUrl: "https://i.pravatar.cc/40?u=user5",
	},
	{
		id: "tp_006",
		iconType: "folder",
		title: "Reporting API Validation",
		description: "Tests for data aggregation and report generation endpoints.",
		creationDate: "10 April, 2025",
		userAvatarUrl: "https://i.pravatar.cc/40?u=user6",
	},
	{
		id: "tp_007",
		iconType: "folder",
		title: "Third-Party Integrations",
		description:
			"Collections for testing integrations with external services and APIs.",
		creationDate: "05 May, 2025",
		userAvatarUrl: "https://i.pravatar.cc/40?u=user7",
	},
	{
		id: "tp_008",
		iconType: "folder",
		title: "Data Migration Scripts",
		description:
			"Testing APIs involved in data import, export, and transformation.",
		creationDate: "20 December, 2024",
		userAvatarUrl: "https://i.pravatar.cc/40?u=user8",
	},
	{
		id: "tp_009",
		iconType: "folder",
		title: "Security & AuthZ Tests",
		description:
			"Focusing on authorization rules, rate limiting, and input sanitization.",
		creationDate: "11 November, 2024",
		userAvatarUrl: "https://i.pravatar.cc/40?u=user9",
	},
	{
		id: "tp_010",
		iconType: "folder",
		title: "Performance Benchmarks",
		description:
			"Collection of requests to measure API response times under load.",
		creationDate: "30 March, 2025",
		userAvatarUrl: "https://i.pravatar.cc/40?u=user10",
	},
];

export const sidebarMenus = {
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
