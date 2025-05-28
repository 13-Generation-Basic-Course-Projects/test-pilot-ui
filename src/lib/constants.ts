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
						value: "get",
						description: "Retrieve all users.",
					},
					{
						id: "ep_001_01_02",
						method: "POST",
						path: "/users",
						value: "post",
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
						value: "get",
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
						value: "post",
						description: "Authenticate user and return token.",
					},
					{
						id: "ep_002_01_02",
						method: "POST",
						path: "/auth/refresh-token",
						value: "post",
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
						value: "post",
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
						value: "get",
						description: "Get a list of all products.",
					},
					{
						id: "ep_003_01_02",
						method: "GET",
						path: "/products/{productId}",
						value: "get",
						description: "Get details for a specific product.",
					},
					{
						id: "ep_003_01_03",
						method: "GET",
						path: "/products/search",
						value: "get",
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
						value: "put",
						description: "Update inventory for a specific product.",
					},
				],
			},
		],
	},
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

export const DATA_TYPES = [
	"String",
	"Date",
	"Integer",
	"Array",
	"File",
	"UUID",
	"Enum",
] as const;

export type DataType = (typeof DATA_TYPES)[number];

export const CodeSnippetValue = [
	{
		language: "javascript",
		label: "JavaScript",
		code: `
function greet() {
  console.log('Hello JavaScript!');
}
    `,
	},
	{
		language: "python",
		label: "Python",
		code: `
def greet():
    print("Hello Python!")
    `,
	},
	{
		language: "java",
		label: "Java",
		code: `
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello Java!");
  }
}
    `,
	},
	{
		language: "csharp",
		label: "C#",
		code: `
using System;
class Program {
  static void Main() {
    Console.WriteLine("Hello C#!");
  }
}
    `,
	},
	{
		language: "html",
		label: "HTML",
		code: `
<!DOCTYPE html>
<html lang="">
  <head><title>Hello HTML</title></head>
  <body>Hello World!</body>
</html>
    `,
	},
	{
		language: "typescript",
		label: "TypeScript",
		code: `
function greet(): void {
  console.log("Hello TypeScript!");
}
    `,
	},
	{
		language: "css",
		label: "CSS",
		code: `
body {
  background-color: #f0f0f0;
  color: #333;
}
    `,
	},
	{
		language: "go",
		label: "Go",
		code: `
package main
import "fmt"
func main() {
  fmt.Println("Hello Go!")
}
    `,
	},
	{
		language: "php",
		label: "PHP",
		code: `
<?php
echo "Hello PHP!";
?>
    `,
	},
	{
		language: "ruby",
		label: "Ruby",
		code: `
def greet
  puts "Hello Ruby!"
end

greet
    `,
	},
];

export const mockHistoryResponses = [
	{
		method: "PUT",
		endpoint: "http://localhost:8080/api/v1/habits",
		status: "200 OK",
		badgeStatus: "passed" as const,
		isSuccess: true,
		shouldShowPreview: true,
		failureReason: null,
		requestBody: JSON.stringify(
			{ habitName: "Morning Run", completed: true },
			null,
			2
		),
		responseBody: JSON.stringify(
			{ message: "Habit updated successfully" },
			null,
			2
		),
	},
	{
		method: "POST",
		endpoint: "http://localhost:8080/api/v1/users/register",
		status: "201 Created",
		badgeStatus: "passed" as const,
		isSuccess: true,
		shouldShowPreview: true,
		failureReason: null,
		requestBody: JSON.stringify(
			{ username: "john_doe", email: "john@example.com" },
			null,
			2
		),
		responseBody: JSON.stringify(
			{ userId: "user_123", token: "abcxyz123" },
			null,
			2
		),
	},
	{
		method: "GET",
		endpoint: "http://localhost:8080/api/v1/tasks",
		status: "200 OK",
		badgeStatus: "failed" as const,
		isSuccess: false,
		shouldShowPreview: true,
		failureReason: "Backend accepts invalid inputs like undefined",
		requestBody: "",
		responseBody: JSON.stringify(
			{
				error: "Invalid user permissions",
				data: null,
			},
			null,
			2
		),
	},
	{
		method: "DELETE",
		endpoint: "http://localhost:8080/api/v1/habits/123",
		status: "404 Not Found",
		badgeStatus: "failed" as const,
		isSuccess: false,
		shouldShowPreview: true,
		failureReason: "Resource not found",
		requestBody: "",
		responseBody: JSON.stringify({ error: "Habit not found" }, null, 2),
	},
	{
		method: "POST",
		endpoint: "http://localhost:8080/api/v1/tasks",
		status: "200 OK",
		badgeStatus: "failed" as const,
		isSuccess: false,
		shouldShowPreview: true,
		failureReason: "Backend doesn't validate undefined taskId",
		requestBody: JSON.stringify({ taskId: undefined }, null, 2),
		responseBody: JSON.stringify(
			{
				message: "Task created with taskId: undefined", // 🚫 Invalid behavior
			},
			null,
			2
		),
	},
	{
		method: "GET",
		endpoint: "http://localhost:8080/api/v1/corrupted-data",
		status: "500 Internal Server Error",
		badgeStatus: "failed" as const,
		isSuccess: false,
		shouldShowPreview: false, // 🚫 No preview
		failureReason: "Internal server error — no data returned",
		requestBody: "",
		responseBody: "", // 👈 No valid JSON
	},
];
