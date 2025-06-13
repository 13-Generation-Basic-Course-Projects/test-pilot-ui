import { Project } from "@/types";
import { FileIcon, HistoryIcon, HomeIcon, InboxIcon } from "lucide-react";

export const projectsData: Project[] = [
	{
		id: "project-1",
		iconType: "folder",
		title: "My Awesome Project",
		description: "This is a description for My Awesome Project.",
		creationDate: "June 3, 2025",
		userAvatarUrl: "/profile-img.png",
		name: "My Awesome Project",
		collections: [
			// {
			// 	id: "collection-auth",
			// 	title: "Authentication",
			// 	description: "Endpoints for user authentication",
			// 	endpoints: [
			// 		{
			// 			id: "endpoint-auth-1",
			// 			method: "POST",
			// 			path: "/api/v1/auth/login",
			// 			description: "Login user",
			// 			url: "http://localhost:3000/api/v1/auth/login",
			// 			status: 200,
			// 			statusText: "OK",
			// 		},
			// 		{
			// 			id: "endpoint-auth-2",
			// 			method: "GET",
			// 			path: "/api/v1/auth/me",
			// 			description: "Get current user",
			// 			url: "http://localhost:3000/api/v1/auth/me",
			// 			status: 200,
			// 			statusText: "OK",
			// 		},
			// 	],
			// },
			{
				id: "collection-users",
				title: "User Management",
				description: "Manage application users",
				endpoints: [
					{
						id: "endpoint-users-1",
						method: "GET",
						path: "/api/v1/users",
						description: "Get all users",
						url: "http://localhost:3000/api/v1/users",
						status: 200,
						statusText: "OK",
					},
					{
						id: "endpoint-users-2",
						method: "POST",
						path: "/api/v1/users",
						description: "Create a new user",
						url: "http://localhost:3000/api/v1/users",
						status: 201,
						statusText: "Created",
					},
				],
			},
			{
				id: "collection-inventory",
				title: "Inventory",
				description: "Manage stock levels for products",
				endpoints: [
					{
						id: "endpoint-inventory-1",
						method: "GET",
						path: "/api/v1/inventory/{productId}",
						description: "Get stock level for a product",
						url: "http://localhost:3000/api/v1/inventory/{productId}",
						status: 200,
						statusText: "OK",
					},
					{
						id: "endpoint-inventory-2",
						method: "PUT",
						path: "/api/v1/inventory/{productId}",
						description: "Update stock level for a product",
						url: "http://localhost:3000/api/v1/inventory/{productId}",
						status: 200,
						statusText: "OK",
					},
				],
			},
			{
				id: "collection-products",
				title: "Product Catalog",
				description: "Manage products in the catalog",
				endpoints: [
					{
						id: "endpoint-products-1",
						method: "GET",
						path: "/api/v1/products",
						description: "Get all products",
						url: "http://localhost:3000/api/v1/products",
						status: 200,
						statusText: "OK",
					},
					{
						id: "endpoint-products-2",
						method: "POST",
						path: "/api/v1/products",
						description: "Create a new product",
						url: "http://localhost:3000/api/v1/products",
						status: 201,
						statusText: "Created",
					},
					{
						id: "endpoint-products-3",
						method: "GET",
						path: "/api/v1/products/{id}",
						description: "Get product by ID",
						url: "http://localhost:3000/api/v1/products/{id}",
						status: 200,
						statusText: "OK",
					},
				],
			},
		],
	},
	// {
	// 	id: "project-3",
	// 	iconType: "folder",
	// 	title: "E-commerce Backend",
	// 	description: "APIs for managing products, orders, and payments.",
	// 	creationDate: "2024-03-10",
	// 	userAvatarUrl: "/profile-img.png",
	// 	name: "E-commerce Backend",
	// 	collections: [
	// 		{
	// 			id: "collection-3",
	// 			title: "Product Catalog",
	// 			description: "Endpoints for product information",
	// 			endpoints: [
	// 				{
	// 					id: "endpoint-5",
	// 					method: "GET",
	// 					path: "/products",
	// 					value: "http://localhost:3000/api/products",
	// 					description: "Retrieve all products",
	// 					url: "http://localhost:3000/api/products",
	// 					status: 200,
	// 					statusText: "OK",
	// 					requestId: "prod-list-1",
	// 				},
	// 				{
	// 					id: "endpoint-6",
	// 					method: "POST",
	// 					path: "/products",
	// 					value: "http://localhost:3000/api/products",
	// 					description: "Add a new product",
	// 					url: "http://localhost:3000/api/products",
	// 					status: 201,
	// 					statusText: "CREATED",
	// 					requestId: "prod-add-1",
	// 				},
	// 				{
	// 					id: "endpoint-7",
	// 					method: "GET",
	// 					path: "/products/{id}",
	// 					value: "http://localhost:3000/api/products/123",
	// 					description: "Get product by ID",
	// 					url: "http://localhost:3000/api/products/123",
	// 					status: 200,
	// 					statusText: "OK",
	// 					requestId: "prod-get-1",
	// 				},
	// 			],
	// 		},
	// 	],
	// },
	// {
	// 	id: "project-6",
	// 	iconType: "folder",
	// 	title: "Inventory Management",
	// 	description: "System for tracking product inventory.",
	// 	creationDate: "2024-02-28",
	// 	userAvatarUrl: "/profile-img.png",
	// 	name: "Inventory Management",
	// 	collections: [
	// 		{
	// 			id: "collection-9",
	// 			title: "Stock Levels",
	// 			description: "Manage product stock.",
	// 			endpoints: [
	// 				{
	// 					id: "endpoint-15",
	// 					method: "GET",
	// 					path: "/inventory/{productId}",
	// 					value: "http://localhost:3000/api/inventory/P001",
	// 					description: "Get stock level for a product",
	// 					url: "http://localhost:3000/api/inventory/P001",
	// 					status: 200,
	// 					statusText: "OK",
	// 					requestId: "inv-stock-1",
	// 				},
	// 				{
	// 					id: "endpoint-16",
	// 					method: "PUT",
	// 					path: "/inventory/{productId}/add",
	// 					value: "http://localhost:3000/api/inventory/P001/add",
	// 					description: "Add stock to a product",
	// 					url: "http://localhost:3000/api/inventory/P001/add",
	// 					status: 200,
	// 					statusText: "OK",
	// 					requestId: "inv-add-1",
	// 				},
	// 			],
	// 		},
	// 	],
	// },
	// {
	// 	id: "project-7",
	// 	iconType: "folder",
	// 	title: "Blog Platform",
	// 	description: "API for a content management system for blogs.",
	// 	creationDate: "2023-09-05",
	// 	userAvatarUrl: "/profile-img.png",
	// 	name: "Blog Platform",
	// 	collections: [
	// 		{
	// 			id: "collection-10",
	// 			title: "Articles",
	// 			description: "Endpoints for blog articles.",
	// 			endpoints: [
	// 				{
	// 					id: "endpoint-17",
	// 					method: "GET",
	// 					path: "/articles",
	// 					value: "http://localhost:3000/api/articles",
	// 					description: "Retrieve all articles",
	// 					url: "http://localhost:3000/api/articles",
	// 					status: 200,
	// 					statusText: "OK",
	// 					requestId: "article-get-all",
	// 				},
	// 				{
	// 					id: "endpoint-18",
	// 					method: "DELETE",
	// 					path: "/articles/{id}",
	// 					value: "http://localhost:3000/api/articles/art-456",
	// 					description: "Delete an article",
	// 					url: "http://localhost:3000/api/articles/art-456",
	// 					status: 204,
	// 					statusText: "NO CONTENT",
	// 					requestId: "article-delete",
	// 				},
	// 			],
	// 		},
	// 	],
	// },
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
	"Number",
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
	// [0] Corresponds to: Email - Invalid Format (Passed)
	{
		method: "POST",
		endpoint: "https://api.kshrd.app/api/v1/auth/register",
		status: "400 BAD REQUEST",
		badgeStatus: "passed" as const,
		isSuccess: true,
		shouldShowPreview: true,
		failureReason: null,
		requestBody: JSON.stringify(
			{
				request: {
					headers: { "Content-Type": "application/json" },
					body: { email: "invalid-email", password: "ValidPassword123" },
				},
				response: {
					headers: { "X-Request-ID": "req-001" },
					body: { error: "Invalid email format" },
				},
			},
			null,
			2
		),
		responseBody: JSON.stringify({ error: "Invalid email format" }, null, 2),
	},
	// [1] Corresponds to: Email - SQL Injection (Passed)
	{
		method: "POST",
		endpoint: "https://api.kshrd.app/api/v1/auth/register",
		status: "400 BAD REQUEST",
		badgeStatus: "passed" as const,
		isSuccess: true,
		shouldShowPreview: true,
		failureReason: null,
		requestBody: JSON.stringify(
			{
				request: {
					headers: { "Content-Type": "application/json" },
					body: { email: "' OR 1=1;--", password: "ValidPassword123" },
				},
				response: {
					headers: { "X-Request-ID": "req-002" },
					body: { error: "Malicious input detected" },
				},
			},
			null,
			2
		),
		responseBody: JSON.stringify(
			{ error: "Malicious input detected" },
			null,
			2
		),
	},
	// [2] Corresponds to: Password - Weak Policy (Passed)
	{
		method: "POST",
		endpoint: "https://api.kshrd.app/api/v1/auth/register",
		status: "400 BAD REQUEST",
		badgeStatus: "passed" as const,
		isSuccess: true,
		shouldShowPreview: true,
		failureReason: null,
		requestBody: JSON.stringify(
			{
				request: {
					headers: { "Content-Type": "application/json" },
					body: { email: "test@example.com", password: "password" },
				},
				response: {
					headers: { "X-Request-ID": "req-003" },
					body: { error: "Password does not meet complexity requirements" },
				},
			},
			null,
			2
		),
		responseBody: JSON.stringify(
			{ error: "Password does not meet complexity requirements" },
			null,
			2
		),
	},
	// [3] Corresponds to: Password - Empty (Passed)
	{
		method: "POST",
		endpoint: "https://api.kshrd.app/api/v1/auth/register",
		status: "400 BAD REQUEST",
		badgeStatus: "passed" as const,
		isSuccess: true,
		shouldShowPreview: true,
		failureReason: null,
		requestBody: JSON.stringify(
			{
				request: {
					headers: { "Content-Type": "application/json" },
					body: { email: "test@example.com", password: "" },
				},
				response: {
					headers: { "X-Request-ID": "req-004" },
					body: { error: "Password cannot be empty" },
				},
			},
			null,
			2
		),
		responseBody: JSON.stringify(
			{ error: "Password cannot be empty" },
			null,
			2
		),
	},
	// [4] Corresponds to: Username - Too Long (Passed)
	{
		method: "POST",
		endpoint: "https://api.kshrd.app/api/v1/auth/register",
		status: "400 BAD REQUEST",
		badgeStatus: "passed" as const,
		isSuccess: true,
		shouldShowPreview: true,
		failureReason: null,
		requestBody: JSON.stringify(
			{
				request: {
					headers: { "Content-Type": "application/json" },
					body: { username: "a".repeat(100) },
				},
				response: {
					headers: { "X-Request-ID": "req-005" },
					body: { error: "Username exceeds maximum length" },
				},
			},
			null,
			2
		),
		responseBody: JSON.stringify(
			{ error: "Username exceeds maximum length" },
			null,
			2
		),
	},
	// [5] Corresponds to: Username - Only Space (Failed)
	{
		method: "POST",
		endpoint: "https://api.kshrd.app/api/v1/auth/register",
		status: "200 OK",
		badgeStatus: "failed" as const,
		isSuccess: false,
		shouldShowPreview: true,
		failureReason: null,
		requestBody: JSON.stringify(
			{
				request: {
					headers: { "Content-Type": "application/json" },
					body: { username: "   ", password: "ValidPassword123" },
				},
				response: {
					headers: { "X-Request-ID": "req-006", "Set-Cookie": "..." },
					body: { message: "User registered successfully!" },
				},
			},
			null,
			2
		),
		responseBody: JSON.stringify(
			{ message: "User registered successfully!" },
			null,
			2
		),
	},
	// [6] Corresponds to: Age - Negative Value (Failed)
	{
		method: "POST",
		endpoint: "https://api.kshrd.app/api/v1/auth/register",
		status: "200 OK",
		badgeStatus: "failed" as const,
		isSuccess: false,
		shouldShowPreview: true,
		failureReason: null,
		requestBody: JSON.stringify(
			{
				request: {
					headers: { "Content-Type": "application/json" },
					body: { username: "testuser", age: -10 },
				},
				response: {
					headers: { "X-Request-ID": "req-007", "Set-Cookie": "..." },
					body: { message: "User registered successfully!" },
				},
			},
			null,
			2
		),
		responseBody: JSON.stringify(
			{ status: "success", message: "User registered successfully!" },
			null,
			2
		),
	},
	// [7] Corresponds to: Age - Type Mismatch (Passed)
	{
		method: "POST",
		endpoint: "https://api.kshrd.app/api/v1/auth/register",
		status: "400 BAD REQUEST",
		badgeStatus: "passed" as const,
		isSuccess: true,
		shouldShowPreview: true,
		failureReason: null,
		requestBody: JSON.stringify(
			{
				request: {
					headers: { "Content-Type": "application/json" },
					body: { username: "testuser", age: "twenty" },
				},
				response: {
					headers: { "X-Request-ID": "req-008" },
					body: { error: "Age must be a number" },
				},
			},
			null,
			2
		),
		responseBody: JSON.stringify({ error: "Age must be a number" }, null, 2),
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
	dataType: string, // This parameter is available if you need type-specific logic later
	testCase: string
): any => {
	switch (testCase) {
		// --- String Cases ---
		case "Empty String":
			return "";
		case "Null Value": // Covers "StringNullnull" and "IntegerNullnull" etc.
			return null;
		case "Undefined":
			return undefined;
		case "Length":
			return "define length for validation";
		case "Numeric String":
			return "12345";
		case "Alphanumeric Mix":
			return "12345abc";
		case "Only Space":
			return "    ";
		case "Special Character":
			return "@#&*!";
		case "String number":
			return "12";
		case "String Too Long":
			// Creates a very long string (2000+ characters). You can adjust the length as needed.
			return "a_very_long_string_".repeat(100);

		// --- Number Cases ---
		case "Zero":
			return 0;
		case "Negative Number": // Covers "Negative"
			return -1;
		case "Non-numeric String":
			return "abc";
		case "Large Number":
			return 999999999999999;
		case "Positive Number":
			return 5;
		case "Large Positive Number":
			return 1000;
		case "Float Number":
			return 1.23;
		case "Max boundary":
			return Number.MAX_SAFE_INTEGER;
		case "Min boundary":
			return Number.MIN_SAFE_INTEGER;
		case "High Precision Float":
			return 0.12345678912345;

		// --- Boolean Cases ---
		case "True":
			return true;
		case "False":
			return false;
		case "Not Boolean":
			return "not_a_boolean";
		case "Boolean as Integer (1)":
			return 1;
		case "Boolean as Integer (0)":
			return 0;
		case "Boolean as String (true)":
			return "true";
		case "Boolean as String (false)":
			return "false";

		// --- Date Cases ---
		case "Valid Date Format":
			return "2023-01-01T10:00:00Z";
		case "Invalid Date Format":
			return "22/04/202aaa";
		case "Invalid Date":
			return "invalid-date";
		case "Future Date":
			return "2050-01-01";
		case "Past Date":
			return "1900-01-01";
		case "ISO Format":
			return new Date().toISOString();
		case "Invalid Calendar Date":
			return "2023-02-30";
		case "Invalid Month Date":
			return "2023-13-01";

		// --- File Cases (represented as filenames) ---
		case "Incorrect File Type":
			return "document.exe";
		case "Image File":
			return "image.jpg";
		case "Video File":
			return "video.mp4";
		case "Empty File":
			return "empty_file.dat";
		case "Max Size (single file)":
			return "5mb_file.zip";
		case "Max Size (multiple file)":
			return "25mb_files.zip";

		// --- UUID Cases ---
		case "Valid UUID":
			return "550e8400-e29b-41d4-a716-446655440000";
		case "Invalid UUID":
			return "550e8400-e29b-41d4-a716";

		// --- Enum Cases ---
		case "Valid Enum Value":
			return "active";
		case "Invalid Enum Value":
			return "deleted"; // Or another value that is invalid in your context

		// --- Array Cases ---
		case "Empty Array":
			return [];
		case "Non-Empty Integer Array":
			return [1, 2, 3];
		case "Non-Empty String Array":
			return ["one", "two", "three"];
		case "Non-Empty Boolean Array":
			return [true, false];
		case "Mixed Data Type Array":
			return [1, "string", true, null];
		case "Nested Arrays":
			return [
				[1, 2],
				[3, 4],
			];
		case "Duplicate Elements":
			return [1, 2, 2, 3];
		case "Array with Null Element (Number)":
			return [1, null, 3];
		case "Array with Null Element (String)":
			return ["a", null, "c"];
		case "Array with Null Element (Boolean)":
			return [true, null, false];

		// --- Default Fallback ---
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

export interface TestCase {
	name: string;
	value: string;
	type:
		| "String"
		| "Date"
		| "File"
		| "Integer"
		| "Boolean"
		| "UUID"
		| "ENUM"
		| "Array";
	description: string;
}

export const ALL_TEST_CASES: TestCase[] = [
	// String Cases
	{
		name: "Empty String",
		value: "",
		type: "String",
		description: "An empty string value.",
	},
	{
		name: "Null String",
		value: "null",
		type: "String",
		description: "A null value represented as a string.",
	},
	{
		name: "Length Validation",
		value: "define length",
		type: "String",
		description: "A string for length validation.",
	},
	{
		name: "Numeric String",
		value: "12345",
		type: "String",
		description: "A string containing only numbers.",
	},
	{
		name: "Alphanumeric Mix",
		value: "12345abc",
		type: "String",
		description: "A mix of letters and numbers.",
	},
	{
		name: "Only Space",
		value: " ",
		type: "String",
		description: "A string containing only spaces.",
	},
	{
		name: "Special Character",
		value: "@#&*!",
		type: "String",
		description: "A string with special characters.",
	},

	// Date Cases
	{
		name: "Valid Date Format",
		value: "2023-01-01T10:00:00Z",
		type: "Date",
		description: "A date in ISO 8601 format.",
	},
	{
		name: "Invalid Date Format",
		value: "22/04/202aaa",
		type: "Date",
		description: "An invalid date format.",
	},
	{
		name: "Past Date",
		value: "1900-01-01",
		type: "Date",
		description: "A date in the past.",
	},
	{
		name: "Future Date",
		value: "2050-01-01",
		type: "Date",
		description: "A date in the future.",
	},
	{
		name: "Invalid Calendar Date",
		value: "2023-02-30",
		type: "Date",
		description: "A non-existent calendar date.",
	},
	{
		name: "Invalid Month",
		value: "2023-13-01",
		type: "Date",
		description: "A date with an invalid month.",
	},

	// File Cases
	{
		name: "Incorrect File Type",
		value: ".exe",
		type: "File",
		description: "An executable file type.",
	},
	{
		name: "Image File",
		value: ".jpg",
		type: "File",
		description: "A common image file type.",
	},
	{
		name: "Video File",
		value: ".mp4",
		type: "File",
		description: "A common video file type.",
	},
	{
		name: "Empty File",
		value: "0 bytes",
		type: "File",
		description: "Represents a zero-byte file.",
	},
	{
		name: "Max Size (Single)",
		value: "5MB",
		type: "File",
		description: "A file at the size limit.",
	},
	{
		name: "Max Size (Multiple)",
		value: "25MB",
		type: "File",
		description: "Multiple files at the size limit.",
	},

	// Integer Cases
	{
		name: "Positive Number",
		value: "5",
		type: "Integer",
		description: "A standard positive integer.",
	},
	{
		name: "Large Positive Number",
		value: "1000000",
		type: "Integer",
		description: "A large positive integer.",
	},
	{
		name: "Null Integer",
		value: "null",
		type: "Integer",
		description: "A null value for an integer field.",
	},
	{
		name: "Float Number",
		value: "1.23",
		type: "Integer",
		description: "A float number string.",
	},
	{
		name: "Negative Number",
		value: "-1",
		type: "Integer",
		description: "A negative integer.",
	},
	{
		name: "Zero",
		value: "0",
		type: "Integer",
		description: "The number zero.",
	},
	{
		name: "Max Boundary",
		value: "max",
		type: "Integer",
		description: "Represents the maximum integer value.",
	},
	{
		name: "Min Boundary",
		value: "min",
		type: "Integer",
		description: "Represents the minimum integer value.",
	},
	{
		name: "String Number",
		value: "'12'",
		type: "Integer",
		description: "A number represented as a string.",
	},
	{
		name: "High Precision Float",
		value: "0.12345678912345",
		type: "Integer",
		description: "A high-precision float.",
	},

	// Boolean Cases
	{
		name: "Null Boolean",
		value: "null",
		type: "Boolean",
		description: "A null value for a boolean field.",
	},
	{
		name: "True",
		value: "true",
		type: "Boolean",
		description: "A true boolean value.",
	},
	{
		name: "False",
		value: "false",
		type: "Boolean",
		description: "A false boolean value.",
	},
	{
		name: "Boolean as Integer (1)",
		value: "1",
		type: "Boolean",
		description: "Boolean true as an integer.",
	},
	{
		name: "Boolean as Integer (0)",
		value: "0",
		type: "Boolean",
		description: "Boolean false as an integer.",
	},
	{
		name: "Boolean as String (true)",
		value: "'true'",
		type: "Boolean",
		description: "Boolean true as a string.",
	},
	{
		name: "Boolean as String (false)",
		value: "'false'",
		type: "Boolean",
		description: "Boolean false as a string.",
	},

	// UUID Cases
	{
		name: "Valid UUID",
		value: "550e8400-e29b-41d4-a716-446655440000",
		type: "UUID",
		description: "A valid UUID.",
	},
	{
		name: "Invalid UUID",
		value: "550e8400-e29b-41d4-a716",
		type: "UUID",
		description: "An invalid or incomplete UUID.",
	},

	// ENUM Cases
	{
		name: "Valid Enum Value",
		value: "active",
		type: "ENUM",
		description: "A valid value from an enumeration.",
	},
	{
		name: "Invalid Enum Value",
		value: "deleted",
		type: "ENUM",
		description: "An invalid value from an enumeration.",
	},

	// Array Cases
	{
		name: "Empty Array",
		value: "[]",
		type: "Array",
		description: "An empty array.",
	},
	{
		name: "Non-Empty Integer Array",
		value: "[1]",
		type: "Array",
		description: "An array with integers.",
	},
	{
		name: "Non-Empty String Array",
		value: "['1']",
		type: "Array",
		description: "An array with strings.",
	},
	{
		name: "Non-Empty Boolean Array",
		value: "[true,false]",
		type: "Array",
		description: "An array with booleans.",
	},
	{
		name: "Mixed Data Type Array",
		value: "[1, 'string', true]",
		type: "Array",
		description: "An array with mixed data types.",
	},
	{
		name: "Nested Arrays",
		value: "[[1,2], [3,4]]",
		type: "Array",
		description: "An array containing other arrays.",
	},
	{
		name: "Duplicate Elements",
		value: "[1, 2, 2]",
		type: "Array",
		description: "An array with duplicate elements.",
	},
	{
		name: "Array with Null (Number)",
		value: "[1, null]",
		type: "Array",
		description: "A numeric array with a null element.",
	},
	{
		name: "Array with Null (String)",
		value: "['1', null]",
		type: "Array",
		description: "A string array with a null element.",
	},
	{
		name: "Array with Null (Boolean)",
		value: "[true, null]",
		type: "Array",
		description: "A boolean array with a null element.",
	},
];
