"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { useParamsApiStore } from "@/store/params-api-slice";
import { useRequestStore } from "@/store/request-url-slice";
import { usePathname, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { EndpointItem } from "@/types"; // ✨ 1. Import EndpointItem type

// ✨ 2. Import BOTH actions
import { getAllPredefinedAction } from "@/action/pre-defined-action";
import { getCustomTestCaseAction } from "@/action/custom-test-case-action";

// Interfaces remain the same
interface TestCase {
	id: string; // ✨ Add id for consistency
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

// ✨ 3. Update the component to accept props
export default function TestRequest({
	request,
	requestId,
}: {
	request: EndpointItem[];
	requestId: string;
}) {
	const { pathVariables, queryParams } = useParamsApiStore();
	const { method, url } = useRequestStore();
	const router = useRouter();
	const pathname = usePathname();
	const [testCases, setTestCases] = useState<TestCase[]>([]);
	// ✨ 4. This useEffect is now updated to fetch ALL test cases (predefined and custom)
	useEffect(() => {
		const fetchTestCases = async () => {
			try {
				// Get projectId from the request prop
				const projectId = pathname.split("/")[2];

				// Fetch both in parallel
				const [predefinedData, customData] = await Promise.all([
					getAllPredefinedAction(),
					projectId ? getCustomTestCaseAction(projectId) : Promise.resolve([]),
				]);

				// Helper to transform data consistently
				const transformToTestCase = (item: any): TestCase => ({
					id: item.id,
					type: item.dataType.name,
					case: item.name,
					value: item.value,
				});

				const transformedPredefined = Array.isArray(predefinedData)
					? predefinedData.map(transformToTestCase)
					: [];

				const transformedCustom = Array.isArray(customData)
					? customData.map(transformToTestCase)
					: [];

				// Combine into a single list
				const allTestCases = [...transformedPredefined, ...transformedCustom];
				setTestCases(allTestCases);
			} catch (error) {
				console.error("Failed to fetch all test cases:", error);
			}
		};

		fetchTestCases();
	}, [request]); // ✨ Depend on `request` prop to refetch if it changes

	// The rest of your component logic does not need to change.
	// `generatePreviewUrl` will now correctly find custom test cases in the `testCases` state.

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

	// The rest of the JSX is unchanged.
	if (!hasUrl) {
		return (
			<div className="w-full max-w-2xl p-6 text-center">
				<p className="text-gray-500">
					Please enter a <strong>URL</strong> in the request builder to generate
					and run test cases.
				</p>
			</div>
		);
	}

	if (validTestCases.length === 0) {
		return (
			<div className="w-full max-w-2xl p-6 text-center">
				<p className="text-gray-500">
					No valid test cases available. Please provide a <strong>key</strong>{" "}
					and <strong>value</strong>
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
