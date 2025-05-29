"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { useParamsApiStore } from "@/store/params-api-slice";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useRequestStore } from "@/store/request-url-slice"; // Assuming this is your Zustand store for method and URL
import { usePathname, useRouter } from "next/navigation";

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

	// State per test case

	const handleRun = () => {
		console.log(`Running test case with method: ${method}, URL: ${url}`);
		console.log(`pathname : ${pathname}`);
		// Here you would typically construct and send your API request
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

			const valueToUse = isCurrentVariable
				? currentTestCase.testCase
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

			const valueToUse = isCurrentVariable
				? currentTestCase.testCase // Use test case value
				: variable.value;

			if (valueToUse !== undefined && valueToUse !== "") {
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

	// Only generate and display test cases if a URL is provided
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
						Run All <Play />
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
								<CardHeader className="flex justify-between items-start">
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
										Run <Play />
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
