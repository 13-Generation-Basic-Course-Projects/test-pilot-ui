"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Loader2 } from "lucide-react";
import { useParamsApiStore } from "@/store/params-api-slice";
import { useRequestStore } from "@/store/request-url-slice";
import { usePathname, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { EndpointItem } from "@/types";
import { toast } from "sonner";
import { runTestCasesAction, TestRunPayload } from "@/action/run-test-action";
import { useTestRunStore } from "@/store/test-run-slice";
import { getAllPredefinedAction } from "@/action/pre-defined-action";
import { getCustomTestCaseAction } from "@/action/custom-test-case-action";
import { useHeaderStore } from "@/store/header-slice";
import { useProjectVariableStore } from "@/store/project-variable-slice"; // --- 1. Import the project variable store

interface TestCase {
	id: string;
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

// --- 2. This helper function is needed to replace [[placeholders]]
const replaceEnvVariablesInUrl = (
	url: string,
	variables: { variable: string; value: string }[]
) => {
	let resolvedUrl = url;
	if (url && variables) {
		variables.forEach((v) => {
			const regex = new RegExp(`\\[\\[${v.variable}\\]\\]`, "gi");
			resolvedUrl = resolvedUrl.replace(regex, v.value);
		});
	}
	return { resolvedUrl };
};

export default function TestRequest({
	request,
	requestId,
}: {
	request: EndpointItem[];
	requestId: string;
}) {
	const { pathVariables, queryParams } = useParamsApiStore();
	const { method } = useRequestStore();
	const { headers } = useHeaderStore();
	const { getEnabledVariables } = useProjectVariableStore(); // --- 3. Get variables from the store
	const router = useRouter();
	const pathname = usePathname();
	const [testCases, setTestCases] = useState<TestCase[]>([]);
	const [isPending, startTransition] = useTransition();
	const { clearTestRunResult, setTestRunResult } = useTestRunStore();

	const endpoint = request.find((ep) => ep.id === requestId);
	const rawUrl = endpoint?.details?.url || "";

	useEffect(() => {
		const fetchTestCases = async () => {
			try {
				const projectId = pathname.split("/")[2];
				const [predefinedData, customData] = await Promise.all([
					getAllPredefinedAction(),
					projectId ? getCustomTestCaseAction(projectId) : Promise.resolve([]),
				]);
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
				const allTestCases = [...transformedPredefined, ...transformedCustom];
				setTestCases(allTestCases);
			} catch (error) {
				console.error("Failed to fetch all test cases:", error);
			}
		};
		fetchTestCases();
	}, [request, pathname]);

	const getValidTestCases = (
		variables: any[],
		type: "path" | "query"
	): ValidTestCase[] => {
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

	// --- 4. This function is now fully corrected
	const generatePreviewUrl = (
		baseUrl: string,
		currentTestCase: ValidTestCase,
		allPathVariables: any[],
		allQueryParams: any[]
	): string => {
		// Step A: Resolve project variables like [[Hello]] FIRST.
		const enabledVariables = getEnabledVariables();
		let constructedUrl = replaceEnvVariablesInUrl(
			baseUrl,
			enabledVariables
		).resolvedUrl;

		// Step B: Now, resolve path variables like {id}.
		allPathVariables.forEach((variable, index) => {
			if (!variable.key) return;
			const isCurrentVariable =
				currentTestCase.type === "path" &&
				currentTestCase.variableIndex === index &&
				currentTestCase.key === variable.key;

			let valueToUse;
			if (isCurrentVariable) {
				const testCaseDetail = testCases.find(
					(tc) => tc.case === currentTestCase.testCase
				);
				valueToUse = testCaseDetail ? testCaseDetail.value : variable.value;
			} else {
				valueToUse = variable.value || `{${variable.key}}`;
			}

			// This prevents multiline values from breaking the URL path
			const finalValue = String(valueToUse).split("\n")[0];

			constructedUrl = constructedUrl.replace(
				new RegExp(`\\{${variable.key}\\}`, "g"),
				finalValue
			);
		});

		// Step C: Finally, add query parameters.
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

	const hasUrl = rawUrl && rawUrl.trim() !== "";
	const validTestCases: ValidTestCase[] = hasUrl
		? [
				...getValidTestCases(pathVariables, "path"),
				...getValidTestCases(queryParams, "query"),
		  ]
		: [];

	const handleRunAllTests = () => {
		clearTestRunResult();
		sessionStorage.removeItem("testRunResult");
		const requestExecution = validTestCases
			.map((testCase) => {
				const fullTestCase = testCases.find(
					(tc) => tc.case === testCase.testCase
				);
				if (!fullTestCase) return null;
				return {
					url: generatePreviewUrl(rawUrl, testCase, pathVariables, queryParams),
					method: method || "GET",
					headers: headers,
					body: {},
					requestId: requestId,
					testCaseId: fullTestCase.id,
					isExpectedSuccess: false,
				};
			})
			.filter((p): p is NonNullable<typeof p> => p !== null);

		if (requestExecution.length === 0) {
			toast.info("No test cases to run.");
			return;
		}
		const finalPayload: TestRunPayload = {
			projectId: pathname.split("/")[2],
			triggerType: "SELECTED_TEST_CASES",
			requestExecution: requestExecution,
			runDate: ""
		};
		console.log("TestRequest (Params/Path) - Run All Payload:", finalPayload);
		startTransition(async () => {
			toast.promise(runTestCasesAction(finalPayload), {
				loading: "Starting test run...",
				success: (result) => {
					if (result && result.data) {
						setTestRunResult(result.data);
						sessionStorage.setItem(
							"testRunResult",
							JSON.stringify(result.data)
						);
						router.push(`${pathname}/monitoring`);
						return "Test run started successfully!";
					}
					return "Test run initiated, but no data returned.";
				},
				error: (err) => {
					console.error("Failed to start test run:", err);
					return "Failed to start test run.";
				},
			});
		});
	};

	const handleRunSingleTest = (testCase: ValidTestCase) => {
		clearTestRunResult();
		sessionStorage.removeItem("testRunResult");
		const fullTestCase = testCases.find((tc) => tc.case === testCase.testCase);
		if (!fullTestCase) {
			toast.error("Test case details not found.");
			return;
		}
		const requestExecution = [
			{
				url: generatePreviewUrl(rawUrl, testCase, pathVariables, queryParams),
				method: method || "GET",
				headers: headers,
				body: {},
				requestId: requestId,
				testCaseId: fullTestCase.id,
				isExpectedSuccess: false,
			},
		];
		const finalPayload: TestRunPayload = {
			projectId: pathname.split("/")[2],
			triggerType: "SELECTED_TEST_CASES",
			requestExecution: requestExecution,
			runDate: ""
		};
		console.log(
			"TestRequest (Params/Path) - Single Run Payload:",
			finalPayload
		);
		startTransition(async () => {
			toast.promise(runTestCasesAction(finalPayload), {
				loading: `Running test: ${testCase.testCase}...`,
				success: (result) => {
					if (result?.data) {
						setTestRunResult(result.data);
						sessionStorage.setItem(
							"testRunResult",
							JSON.stringify(result.data)
						);
						router.push(`${pathname}/monitoring`);
						return "Test run started successfully!";
					}
					console.error(
						"Test run succeeded but returned no data. Full result:",
						result
					);
					return "Test run initiated, but no data was returned from the backend.";
				},
				error: (err) => `Failed to start test run: ${err.message}`,
			});
		});
	};

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
					and <strong>value</strong> for each variable, and ensure test cases
					are defined.
				</p>
			</div>
		);
	}

	return (
		<>
			<div className="  flex flex-col space-y-4">
				<div className="flex h-full justify-end items-center mt-1">
					<Button
						onClick={handleRunAllTests}
						disabled={isPending || validTestCases.length === 0}
					>
						{isPending ? "Running..." : "Run All"}{" "}
						<Play className="ml-2 h-4 w-4" />
					</Button>
				</div>
				<div className="flex flex-col items-center gap-6">
					{validTestCases.map((testcase, idx) => {
						const previewUrl = generatePreviewUrl(
							rawUrl,
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
									<Button
										onClick={() => handleRunSingleTest(testcase)}
										disabled={isPending}
									>
										{isPending ? (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										) : (
											"Run"
										)}
										<Play className="ml-2 h-4 w-4" />
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
