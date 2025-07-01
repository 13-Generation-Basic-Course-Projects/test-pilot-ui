import { Project } from "@/types";
import { FileIcon, HistoryIcon, HomeIcon, InboxIcon } from "lucide-react";

const BASE_URL = "http://localhost:3000";
const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_AUTH_GITHUB_ID;
const GITHUB_API = process.env.NEXT_PUBLIC_AUTH_GITHUB_API;

export const GITHUB_LOGIN = `${GITHUB_API}?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${BASE_URL}/login&scope=read:user%20user:email`;

export const projectsData: Project[] = [
	{
		id: "project-1",
		iconType: "folder",
		title: "My Awesome Project",
		description: "This is a description for My Awesome Project.",
		creationDate: "2023-01-15",
		userAvatarUrl: "/profile-img.png",
		name: "My Awesome Project",
		collections: [
			{
				id: "collection-1",
				title: "User Management",
				// description: "APIs for user operations",
				endpoints: [
					{
						id: "endpoint-1",
						method: "GET",
						name: "",
						path: "/users",
						value: "http://localhost:3000/api/users",
						description: "Get all users",
						url: "http://localhost:3000/api/users",
						status: 200,
						statusText: "OK",
						requestId: "req-123",
					},
					{
						id: "endpoint-2",
						method: "POST",
						name: "",
						path: "/users",
						value: "http://localhost:3000/api/users",
						description: "create user",
						url: "http://localhost:3000/api/users",
						status: 201,
						statusText: "CREATED",
						requestId: "req-1234",
					},
				],
			},
		],
	},
	{
		id: "project-3",
		iconType: "folder",
		title: "E-commerce Backend",
		description: "APIs for managing products, orders, and payments.",
		creationDate: "2024-03-10",
		userAvatarUrl: "/profile-img.png",
		name: "E-commerce Backend",
		collections: [
			{
				id: "collection-3",
				title: "Product Catalog",
				// description: "Endpoints for product information",
				endpoints: [
					{
						id: "endpoint-5",
						method: "GET",
						name: "",
						path: "/products",
						value: "http://localhost:3000/api/products",
						description: "Retrieve all products",
						url: "http://localhost:3000/api/products",
						status: 200,
						statusText: "OK",
						requestId: "prod-list-1",
					},
					{
						id: "endpoint-6",
						method: "POST",
						name: "",
						path: "/products",
						value: "http://localhost:3000/api/products",
						description: "Add a new product",
						url: "http://localhost:3000/api/products",
						status: 201,
						statusText: "CREATED",
						requestId: "prod-add-1",
					},
					{
						id: "endpoint-7",
						method: "GET",
						name: "",
						path: "/products/{id}",
						value: "http://localhost:3000/api/products/123",
						description: "Get product by ID",
						url: "http://localhost:3000/api/products/123",
						status: 200,
						statusText: "OK",
						requestId: "prod-get-1",
					},
				],
			},
		],
	},
	{
		id: "project-6",
		iconType: "folder",
		title: "Inventory Management",
		description: "System for tracking product inventory.",
		creationDate: "2024-02-28",
		userAvatarUrl: "/profile-img.png",
		name: "Inventory Management",
		collections: [
			{
				id: "collection-9",
				title: "Stock Levels",
				// description: "Manage product stock.",
				endpoints: [
					{
						id: "endpoint-15",
						method: "GET",
						name: "",
						path: "/inventory/{productId}",
						value: "http://localhost:3000/api/inventory/P001",
						description: "Get stock level for a product",
						url: "http://localhost:3000/api/inventory/P001",
						status: 200,
						statusText: "OK",
						requestId: "inv-stock-1",
					},
					{
						id: "endpoint-16",
						method: "PUT",
						name: "",
						path: "/inventory/{productId}/add",
						value: "http://localhost:3000/api/inventory/P001/add",
						description: "Add stock to a product",
						url: "http://localhost:3000/api/inventory/P001/add",
						status: 200,
						statusText: "OK",
						requestId: "inv-add-1",
					},
				],
			},
		],
	},
	{
		id: "project-7",
		iconType: "folder",
		title: "Blog Platform",
		description: "API for a content management system for blogs.",
		creationDate: "2023-09-05",
		userAvatarUrl: "/profile-img.png",
		name: "Blog Platform",
		collections: [
			{
				id: "collection-10",
				title: "Articles",
				// description: "Endpoints for blog articles.",
				endpoints: [
					{
						id: "endpoint-17",
						method: "GET",
						name: "",
						path: "/articles",
						value: "http://localhost:3000/api/articles",
						description: "Retrieve all articles",
						url: "http://localhost:3000/api/articles",
						status: 200,
						statusText: "OK",
						requestId: "article-get-all",
					},
					{
						id: "endpoint-18",
						method: "DELETE",
						name: "",
						path: "/articles/{id}",
						value: "http://localhost:3000/api/articles/art-456",
						description: "Delete an article",
						url: "http://localhost:3000/api/articles/art-456",
						status: 204,
						statusText: "NO CONTENT",
						requestId: "article-delete",
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

// utils/data-type-cases.ts
export const dataTypeOptions = [
	{ label: "String", value: "string" },
	{ label: "Number", value: "number" },
	{ label: "Boolean", value: "boolean" },
	{ label: "Date", value: "date" },
];

export const caseByDataType: Record<string, string[]> = {
	string: [
		"Empty String",
		"Null Value",
		"Length",
		"Alphanumeric Mix",
		"Only Space",
		"Special Character",
	],
	number: ["Zero", "Negative", "Non-numeric String", "Large Number"],
	boolean: ["True", "False", "Not Boolean"],
	date: ["Invalid Date", "Future Date", "Past Date", "ISO Format"],
};

export const generateValueForTestCase = (
	originalValue: any,
	dataType: string,
	testCase: string
): any => {
	switch (testCase) {
		case "Empty String":
			return "";
		case "Null Value":
			return null;
		case "Undefined":
			return undefined;
		case "Zero":
			return 0;
		case "Negative":
			return -1;
		case "Non-numeric String":
			return "abc";
		case "Large Number":
			return 999999999999999;
		case "True":
			return true;
		case "False":
			return false;
		case "Not Boolean":
			return "not_a_boolean";
		case "Invalid Date":
			return "invalid-date";
		case "Future Date":
			return new Date(Date.now() + 86400000).toISOString();
		case "Past Date":
			return new Date(Date.now() - 86400000).toISOString();
		case "ISO Format":
			return new Date().toISOString();
		default:
			return originalValue;
	}
};

export const getMethodColor = (method: string) => {
	switch (method.toUpperCase()) {
		case "GET":
			return "text-green-600";
		case "POST":
			return "text-blue-600";
		case "PUT":
			return "text-yellow-600";
		case "DELETE":
			return "text-red-600";
		case "PATCH":
			return "text-purple-600";
		default:
			return "text-gray-600";
	}
};
