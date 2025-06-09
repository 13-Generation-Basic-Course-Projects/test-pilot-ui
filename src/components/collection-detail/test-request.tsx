"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { useParamsApiStore } from "@/store/params-api-slice";
import { useRequestStore } from "@/store/request-url-slice";
import { usePathname, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// FIX: Add the testCases constant so we can look up the value from the case name.
const testCases = [
	{ type: "String", case: "Empty String", value: "" },
	{ type: "String", case: "Null", value: null },
	{
		type: "String",
		case: "String length define length for validation",
		value: "StringLength",
	},
	{ type: "String", case: "Numeric String", value: "12345" },
	{ type: "String", case: "Alphanumeric Mix", value: "12345abc" },
	{ type: "String", case: "Only Space", value: " " },
	{ type: "String", case: "Special Character", value: "@#&*!" },
	{ type: "Date", case: "Valid Date Format", value: "2023-01-01T10:00:00Z" },
	{ type: "Date", case: "Invalid Date Format", value: "22/04/202aaa" },
	{ type: "Date", case: "Past Date", value: "1900-01-01" },
	{ type: "Date", case: "Future Date", value: "2050-01-01" },
	{ type: "Date", case: "Invalid Calendar Date", value: "2023-02-30" },
	{ type: "Date", case: "Invalid Month Date", value: "2023-13-01" },
	{ type: "File", case: "Incorrect File Type", value: ".exe" },
	{ type: "File", case: "Image File", value: ".jpg" },
	{ type: "File", case: "Video File", value: ".mp4" },
	{ type: "File", case: "Empty File", value: "0 byte file" },
	{ type: "File", case: "MaxSize (single file)", value: "5Mb (limit 5Mb)" },
	{ type: "File", case: "MaxSize (multiple file)", value: "25Mb (limit 5Mb)" },
	{ type: "Integer", case: "Positive Number", value: 5 },
	{ type: "Integer", case: "Large Positive Number", value: 1000 },
	{ type: "Integer", case: "Null", value: null },
	{ type: "Integer", case: "Float Number", value: 1.23 },
	{ type: "Integer", case: "Negative Number", value: -1 },
	{ type: "Integer", case: "Zero", value: 0 },
	{ type: "Integer", case: "Max boundary", value: "max" },
	{ type: "Integer", case: "Min boundary", value: "min" },
	{ type: "Integer", case: "String number", value: "12" },
	{ type: "Integer", case: "High Precision Float", value: 0.12345678912345 },
	{ type: "Boolean", case: "Null", value: null },
	{ type: "Boolean", case: "True", value: true },
	{ type: "Boolean", case: "False", value: false },
	{ type: "Boolean", case: "Boolean as Integer (1)", value: 1 },
	{ type: "Boolean", case: "Boolean as Integer (0)", value: 0 },
	{ type: "Boolean", case: "Boolean as String (true)", value: "true" },
	{ type: "Boolean", case: "Boolean as String (false)", value: "false" },
	{
		type: "UUID",
		case: "Valid UUID",
		value: "550e8400-e29b-41d4-a716-446655440000",
	},
	{ type: "UUID", case: "Invalid UUID", value: "550e8400-e29b-41d4-a716" },
	{ type: "ENUM", case: "Valid Enum Value", value: "active" },
	{ type: "ENUM", case: "Invalid Enum Value", value: "deleted" },
	{ type: "Array", case: "Empty Array", value: [] },
	{ type: "Array", case: "Non-Empty Integer Array", value: [1] },
	{ type: "Array", case: "Non-Empty String Array", value: ["1"] },
	{ type: "Array", case: "Non-Empty Boolean Array", value: [true, false] },
	{ type: "Array", case: "Mixed Data Type Array", value: [1, "string", true] },
	{
		type: "Array",
		case: "Nested Arrays",
		value: [
			[1, 2],
			[3, 4],
		],
	},
	{ type: "Array", case: "Duplicate Elements", value: [1, 2, 2] },
	{ type: "Array", case: "Array with Null Element (Number)", value: [1, null] },
	{
		type: "Array",
		case: "Array with Null Element (String)",
		value: ["1", null],
	},
	{
		type: "Array",
		case: "Array with Null Element (Boolean)",
		value: [true, null],
	},
];

interface ValidTestCase {
	key: string;
	testCase: string;
	type: "path" | "query";
	value: any;
	variableIndex: number;
}

export default function TestRequest() {
	const { pathVariables, queryParams } = useParamsApiStore();
	const { method, url } = useRequestStore();
	const router = useRouter();
	const pathname = usePathname();

	const getValidTestCases = (variables: any[], type: "path" | "query") => {
		return (
			variables
				.filter(
					(variable) =>
						variable.key && variable.value && variable.cases?.length > 0
				)
				.flatMap((variable, varIndex) =>
					variable.cases.map((testCase: string) => ({
						type,
						key: variable.key,
						value: variable.value,
						variableIndex: varIndex,
						testCase,
					}))
				) || []
		);
	};

	const handleRun = () => {
		console.log(`Running test case with method: ${method}, URL: ${url}`);
		console.log(`pathname : ${pathname}`);
		router.push(`${pathname}/monitoring`);
	};

	const generatePreviewUrl = (
		baseUrl: string,
		currentTestCase: ValidTestCase,
		allPathVariables: any[],
		allQueryParams: any[]
	): string => {
		let constructedUrl = baseUrl;

		// Replace path parameters
		allPathVariables.forEach((variable, index) => {
			if (!variable.key) return;

			const isCurrentVariable =
				currentTestCase.type === "path" &&
				currentTestCase.variableIndex === index &&
				currentTestCase.key === variable.key;

			// FIX: Look up the actual value from the testCases constant
			const valueToUse = isCurrentVariable
				? testCases.find((tc) => tc.case === currentTestCase.testCase)?.value ??
				  ""
				: variable.value || `{${variable.key}}`;

			constructedUrl = constructedUrl.replace(
				new RegExp(`\\{${variable.key}\\}`, "g"),
				valueToUse
			);
		});

		// Build query parameters
		const queryParts: string[] = [];
		allQueryParams.forEach((variable, index) => {
			if (!variable.key) return;

			const isCurrentVariable =
				currentTestCase.type === "query" &&
				currentTestCase.variableIndex === index &&
				currentTestCase.key === variable.key;

			// FIX: Look up the actual value from the testCases constant
			const valueToUse = isCurrentVariable
				? testCases.find((tc) => tc.case === currentTestCase.testCase)?.value
				: variable.value;

			if (
				valueToUse !== undefined &&
				valueToUse !== null &&
				valueToUse !== ""
			) {
				queryParts.push(
					`${encodeURIComponent(variable.key)}=${encodeURIComponent(
						valueToUse
					)}`
				);
			}
		});

		if (queryParts.length > 0) {
			constructedUrl +=
				(constructedUrl.includes("?") ? "&" : "?") + queryParts.join("&");
		}

		return constructedUrl;
	};

	const hasUrl = url && url.trim() !== "";
	const validTestCases: ValidTestCase[] = hasUrl
		? [
				...getValidTestCases(pathVariables, "path"),
				...getValidTestCases(queryParams, "query"),
		  ]
		: [];

	if (!hasUrl) {
		return (
			<div className="w-full max-w-2xl p-6 text-center">
				<p className="text-gray-500">
					Please enter a **URL** in the request builder to generate and run test
					cases.
				</p>
			</div>
		);
	}

	if (validTestCases.length === 0) {
		return (
			<div className="w-full max-w-2xl p-6 text-center">
				<p className="text-gray-500">
					No valid test cases available. Please provide a **key** and **value**
					for each variable, and ensure test cases are defined.
				</p>
			</div>
		);
	}

	return (
		<>
			<div className=" min-h-[480px] flex flex-col space-y-4">
				<div className="flex h-full justify-end items-center mt-1">
					<Button onClick={() => handleRun()}>
						Run All <Play className="ml-2 h-4 w-4" />
					</Button>
				</div>
				<div className="flex flex-col items-center gap-6">
					{validTestCases.map((testcase, idx) => {
						const previewUrl = generatePreviewUrl(
							url,
							testcase,
							pathVariables,
							queryParams
						);
						return (
							<Card
								key={`${testcase.key}-${testcase.testCase}-${idx}`}
								className="break-all w-full"
							>
								<CardHeader className="flex flex-row justify-between items-start">
									<div className="space-y-4 w-full">
										<CardTitle className="text-md">
											Fields :{" "}
											<Badge variant="secondary">
												<p className="text-[#006FEE] text-[14px]">
													{testcase.key}
												</p>
											</Badge>
										</CardTitle>
										<CardTitle className="text-md">
											Scenario :{" "}
											<Badge variant="default">
												<p className="text-xs">{testcase.testCase}</p>
											</Badge>
										</CardTitle>
										<CardTitle className="text-md">
											{testcase.type === "path"
												? "Request Path Variable"
												: "Request Query Params"}
										</CardTitle>
									</div>
									<Button onClick={() => handleRun()}>
										Run <Play className="ml-2 h-4 w-4" />
									</Button>
								</CardHeader>
								<CardContent>
									<pre className="bg-gray-100 p-3 rounded-md text-sm overflow-auto">
										{previewUrl}
									</pre>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</>
	);
}
