"use client";
import { useEffect, useState } from "react"; // 1. Import useEffect and useState
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { useParamsApiStore } from "@/store/params-api-slice";
import { useRequestStore } from "@/store/request-url-slice";
import { usePathname, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getAllPredefinedAction } from "@/action/pre-defined-action"; // 2. Import your action

interface TestCase {
	type: string;
	case: string;
	value: any;
}

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

	// 4. Add state to hold the test cases from the backend
	const [testCases, setTestCases] = useState<TestCase[]>([]);

	// 5. Fetch and set the test cases when the component mounts
	useEffect(() => {
		const fetchTestCases = async () => {
			const backendData = await getAllPredefinedAction();
			if (backendData && Array.isArray(backendData)) {
				const transformedData: TestCase[] = backendData.map((item: any) => ({
					type: item.dataType.name,
					case: item.name,
					value: item.value,
				}));
				setTestCases(transformedData);
			}
		};
		fetchTestCases();
	}, []);

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

			// This logic now uses the `testCases` state variable automatically
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

			// This logic also uses the `testCases` state variable
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
