"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useApiBodyStore } from "@/store/body-api-slice";
import { Play, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequestStore } from "@/store/request-url-slice";
import { toast } from "sonner";
import { runTestCasesAction, TestRunPayload } from "@/action/run-test-action";
import { getAllPredefinedAction } from "@/action/pre-defined-action";
import { getCustomTestCaseAction } from "@/action/custom-test-case-action";
import { useTestRunStore } from "@/store/test-run-slice";
import { useHeaderStore } from "@/store/header-slice";

interface TestCase {
	id: string;
	type: string;
	case: string;
	value: any;
}

interface TestCasePayload {
	field: string;
	testCase: string;
	testCaseId: string;
	payload: Record<string, any>;
}

export const TestRequestBody = ({
	projectId,
	requestId,
}: {
	projectId: string;
	requestId: string;
}) => {
	const { apiBodyRows } = useApiBodyStore();
	const { method, url } = useRequestStore();
	const { headers } = useHeaderStore();
	const router = useRouter();
	const pathname = usePathname();
	const [testCases, setTestCases] = useState<TestCase[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isPending, startTransition] = useTransition();
	const { clearTestRunResult, setTestRunResult } = useTestRunStore();

	useEffect(() => {
		const fetchTestCases = async () => {
			setIsLoading(true);
			try {
				const [predefinedData, customData] = await Promise.all([
					getAllPredefinedAction(),
					getCustomTestCaseAction(projectId),
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
				console.error("Failed to fetch test cases:", error);
				toast.error("Failed to load test case data.");
			} finally {
				setIsLoading(false);
			}
		};

		if (projectId) {
			fetchTestCases();
		}
	}, [projectId]);

	const testCasePayloads: TestCasePayload[] = apiBodyRows.flatMap((row) => {
		const basePayload = apiBodyRows.reduce((acc, r) => {
			acc[r.id] = r.value;
			return acc;
		}, {} as Record<string, any>);

		return row.testCases
			.map((testCaseName) => {
				const fullTestCase = testCases.find((tc) => tc.case === testCaseName);
				if (!fullTestCase) return null;

				const modifiedPayload = { ...basePayload };
				modifiedPayload[row.id] = fullTestCase.value;

				return {
					field: row.id,
					testCase: testCaseName,
					testCaseId: fullTestCase.id,
					payload: modifiedPayload,
				};
			})
			.filter((item): item is TestCasePayload => item !== null);
	});

	const runTests = (requests: any[], context: string) => {
		clearTestRunResult();
		sessionStorage.removeItem("testRunResult");

		const finalPayload: TestRunPayload = {
			projectId: projectId,
			triggerType: "SELECTED_TEST_CASES",
			requestExecution: requests,
		};

		// --- ❗️ CONSOLE LOG ADDED HERE ❗️ ---
		console.log(`TestRequestBody - ${context} Payload:`, finalPayload);

		startTransition(async () => {
			toast.promise(runTestCasesAction(finalPayload), {
				loading: `Running ${requests.length} test(s)...`,
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

	const handleRunAllTests = () => {
		const allRequests = testCasePayloads.map((testCase) => ({
			url: url,
			method: method || "GET",
			headers: headers,
			body: testCase.payload,
			requestId: requestId,
			testCaseId: testCase.testCaseId,
			isExpectedSuccess: false,
		}));
		if (allRequests.length > 0) {
			runTests(allRequests, "Run All");
		} else {
			toast.info("No test cases to run.");
		}
	};

	const handleRunSingleTest = (testCase: TestCasePayload) => {
		const singleRequest = [
			{
				url: url,
				method: method || "GET",
				headers: headers,
				body: testCase.payload,
				requestId: requestId,
				testCaseId: testCase.testCaseId,
				isExpectedSuccess: false,
			},
		];
		runTests(singleRequest, "Single Run");
	};

	const CardSkeleton = () => (
		<Card className="w-full">
			<CardHeader className="flex flex-row justify-between items-start">
				<div className="space-y-4 w-full">
					<div className="flex items-center gap-2">
						<Skeleton className="h-5 w-12" />
						<Skeleton className="h-6 w-28 rounded-full" />
					</div>
					<div className="flex items-center gap-2">
						<Skeleton className="h-5 w-16" />
						<Skeleton className="h-6 w-36 rounded-full" />
					</div>
					<Skeleton className="h-5 w-28" />
				</div>
				<Skeleton className="h-10 w-24 rounded-md ml-4" />
			</CardHeader>
			<CardContent>
				<Skeleton className="h-24 w-full rounded-md" />
			</CardContent>
		</Card>
	);

	return (
		<div className=" min-h-[480px] flex flex-col space-y-4">
			<div className="flex h-full justify-end items-center mt-1">
				<Button
					onClick={handleRunAllTests}
					disabled={isLoading || isPending || testCasePayloads.length === 0}
				>
					{isPending ? "Running..." : "Run All"}
					<Play className="ml-2 h-4 w-4" />
				</Button>
			</div>
			<div className="flex flex-col items-center gap-6">
				{isLoading ? (
					[...Array(3)].map((_, index) => <CardSkeleton key={index} />)
				) : testCasePayloads.length === 0 ? (
					<div className="flex items-center justify-center min-h-[400px]">
						<p className="text-muted-foreground">
							No test cases have been selected yet.
						</p>
					</div>
				) : (
					testCasePayloads.map((testCase, index) => (
						<Card
							key={`${testCase.field}-${testCase.testCase}-${index}`}
							className="break-all w-full"
						>
							<CardHeader className="flex flex-row justify-between items-start">
								<div className="space-y-4 w-full">
									<CardTitle className="text-md">
										Field :{" "}
										<Badge variant="secondary" className="text-[#006FEE]">
											{testCase.field}
										</Badge>
									</CardTitle>
									<CardTitle className="text-md">
										Scenario :{" "}
										<Badge variant="default">{testCase.testCase}</Badge>
									</CardTitle>
									<CardTitle className="text-md">Request Body :</CardTitle>
								</div>
								<Button
									onClick={() => handleRunSingleTest(testCase)}
									disabled={isPending}
								>
									{isPending ? (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									) : (
										"Run"
									)}
								</Button>
							</CardHeader>
							<CardContent>
								<pre className="bg-gray-100 p-3 rounded-md text-sm overflow-auto">
									<code>{JSON.stringify(testCase.payload, null, 2)}</code>
								</pre>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	);
};
