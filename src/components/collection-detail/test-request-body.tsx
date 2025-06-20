"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useApiBodyStore } from "@/store/body-api-slice";
import { Play } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { getAllPredefinedAction } from "@/action/pre-defined-action";
import { Skeleton } from "@/components/ui/skeleton";
import { useParamsApiStore } from "@/store/params-api-slice";
import { useRequestStore } from "@/store/request-url-slice";
import { toast } from "sonner";

// ✨ 1. Import the new action and payload type
import { runTestCasesAction, TestRunPayload } from "@/action/run-test-action";

interface TestCase {
	id: string; // Add ID to the interface
	type: string;
	case: string;
	value: any;
}

// ✨ 2. Accept projectId and requestId as props
export const TestRequestBody = ({
	projectId,
	requestId,
}: {
	projectId: string;
	requestId: string;
}) => {
	const { apiBodyRows } = useApiBodyStore();
	const { pathVariables, queryParams } = useParamsApiStore();
	const { method, url } = useRequestStore();
	const router = useRouter();
	const pathname = usePathname();

	const [testCases, setTestCases] = useState<TestCase[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isPending, startTransition] = useTransition(); // For the run action

	useEffect(() => {
		const fetchTestCases = async () => {
			setIsLoading(true);
			try {
				const backendData = await getAllPredefinedAction();
				if (backendData && Array.isArray(backendData)) {
					const transformedData: TestCase[] = backendData.map((item: any) => ({
						id: item.id, // Ensure ID is mapped
						type: item.dataType.name,
						case: item.name,
						value: item.value,
					}));
					setTestCases(transformedData);
				}
			} catch (error) {
				console.error("Failed to fetch test cases:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchTestCases();
	}, []);

	// This logic now generates the final payloads for each test case
	const testCasePayloads = apiBodyRows.flatMap((row) => {
		// Create a base payload with the default values for all fields
		const basePayload = apiBodyRows.reduce((acc, r) => {
			acc[r.id] = r.value;
			return acc;
		}, {} as Record<string, any>);

		// For each selected test case on this row, create a scenario
		return row.testCases
			.map((testCaseName) => {
				const fullTestCase = testCases.find((tc) => tc.case === testCaseName);
				if (!fullTestCase) return null; // Skip if test case not found

				const modifiedPayload = { ...basePayload };
				modifiedPayload[row.id] = fullTestCase.value;

				return {
					field: row.id,
					testCase: testCaseName,
					testCaseId: fullTestCase.id, // Include the test case ID
					payload: modifiedPayload,
				};
			})
			.filter(Boolean); // Filter out any nulls
	});

	// ✨ 3. The new handleRun function that builds and sends the payload
	const handleRun = () => {
		// Build the `requestExecution` array from our generated payloads
		const requestExecution = testCasePayloads.map((testCase) => ({
			url: url, // From useRequestStore
			method: method || "GET", // From useRequestStore
			headers: {
				// You would get the final merged headers from your header store/state here
				...pathVariables, // Example of including other params
				...queryParams,
			},
			body: testCase!.payload, // The generated body for this specific test case
			requestId: requestId, // The ID of the request being tested
			testCaseId: testCase!.testCaseId, // The ID of the test case being applied
			isExpectedSuccess: false, // Defaulting this, can be configured later
		}));

		// Build the final payload object
		const finalPayload: TestRunPayload = {
			projectId: projectId,
			triggerType: "SELECTED_TEST_CASES",
			requestExecution: requestExecution,
		};

		startTransition(async () => {
			toast.promise(runTestCasesAction(finalPayload), {
				loading: "Starting test run...",
				success: (result) => {
					// Navigate to the monitoring page on success
					// router.push(`${pathname}/monitoring`);
					return "Test run started successfully!";
				},
				error: "Failed to start test run.",
			});
		});
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
					onClick={handleRun}
					disabled={isLoading || isPending || testCasePayloads.length === 0}
				>
					{isPending ? "Running..." : "Run All"}
					<Play className="ml-2 h-4 w-4" />
				</Button>
			</div>
			{/* The rest of your JSX for displaying cards remains the same */}
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
							key={`${testCase!.field}-${testCase!.testCase}-${index}`}
							className="break-all w-full"
						>
							<CardHeader className="flex flex-row justify-between items-start">
								<div className="space-y-4 w-full">
									<CardTitle className="text-md">
										Field :{" "}
										<Badge variant="secondary" className="text-[#006FEE]">
											{testCase!.field}
										</Badge>
									</CardTitle>
									<CardTitle className="text-md">
										Scenario :{" "}
										<Badge variant="default">{testCase!.testCase}</Badge>
									</CardTitle>
									<CardTitle className="text-md">Request Body :</CardTitle>
								</div>
								{/* Per-test run button can be added later if needed */}
							</CardHeader>
							<CardContent>
								<pre className="bg-gray-100 p-3 rounded-md text-sm overflow-auto">
									<code>{JSON.stringify(testCase!.payload, null, 2)}</code>
								</pre>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	);
};
