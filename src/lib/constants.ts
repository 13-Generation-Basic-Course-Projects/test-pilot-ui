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
		collections: [
			{
				id: "col_001_01",
				title: "User Management APIs",
				description:
					"Collections for user creation, retrieval, update, and deletion.",
				endpoints: [
					// 🔽 Added endpoints array
					{
						id: "ep_001_01_01",
						method: "GET",
						path: "/users",
						description: "Retrieve all users.",
					},
					{
						id: "ep_001_01_02",
						method: "POST",
						path: "/users",
						description: "Create a new user.",
					},
				],
			},
			{
				id: "col_001_02",
				title: "Content Management APIs",
				description: "Collections for managing application content.",
				endpoints: [
					{
						id: "ep_001_02_01",
						method: "GET",
						path: "/posts",
						description: "Retrieve all posts.",
					},
				],
			},
		],
	},
	{
		id: "tp_002",
		iconType: "folder",
		title: "User Authentication Suite",
		description:
			"Validating login, registration, password reset, and token management.",
		creationDate: "15 May, 2025",
		userAvatarUrl: "https://i.pravatar.cc/40?u=user2",
		collections: [
			{
				id: "col_002_01",
				title: "Login Endpoints",
				description: "Endpoints for user login and session creation.",
				endpoints: [
					{
						id: "ep_002_01_01",
						method: "POST",
						path: "/auth/login",
						description: "Authenticate user and return token.",
					},
					{
						id: "ep_002_01_02",
						method: "POST",
						path: "/auth/refresh-token",
						description: "Refresh authentication token.",
					},
				],
			},
			{
				id: "col_002_02",
				title: "Registration Endpoints",
				description: "Endpoints for new user registration.",
				endpoints: [
					{
						id: "ep_002_02_01",
						method: "POST",
						path: "/auth/register",
						description: "Register a new user account.",
					},
				],
			},
		],
	},
	// ... (Apply similar structure to other projects)
	{
		id: "tp_003",
		iconType: "folder",
		title: "E-commerce Product Endpoints",
		description:
			"Tests for product listing, details, search, and inventory updates.",
		creationDate: "02 January, 2025",
		userAvatarUrl: "https://i.pravatar.cc/40?u=user3",
		collections: [
			{
				id: "col_003_01",
				title: "Product Catalog",
				description: "APIs for accessing product information.",
				endpoints: [
					{
						id: "ep_003_01_01",
						method: "GET",
						path: "/products",
						description: "Get a list of all products.",
					},
					{
						id: "ep_003_01_02",
						method: "GET",
						path: "/products/{productId}",
						description: "Get details for a specific product.",
					},
					{
						id: "ep_003_01_03",
						method: "GET",
						path: "/products/search",
						description: "Search for products.",
					},
				],
			},
			{
				id: "col_003_02",
				title: "Inventory Management",
				description: "APIs for updating product stock levels.",
				endpoints: [
					{
						id: "ep_003_02_01",
						method: "PUT",
						path: "/products/{productId}/inventory",
						description: "Update inventory for a specific product.",
					},
				],
			},
		],
	},
	// Add more projects with their collections and endpoints as needed
];

export const sidebarMenus = {
	sideMenu: [
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
