"use client";
import React, { useState, useEffect } from "react";
import { useApiBodyStore } from "@/store/body-api-slice";
import { Play } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { getAllPredefinedAction } from "@/action/pre-defined-action"; // 1. Import your action

// 2. Define an interface for a single test case object
interface TestCase {
	type: string;
	case: string;
	value: any;
}

export const TestRequestBody = () => {
	const { apiBodyRows } = useApiBodyStore();
	const router = useRouter();
	const pathname = usePathname();

	// 3. Add state to hold the list of test cases from the backend
	const [testCases, setTestCases] = useState<TestCase[]>([]);

	// 4. Fetch the test cases when the component mounts
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

	// Generate all test case payloads
	const testCasePayloads: {
		field: string;
		testCase: string;
		payload: Record<string, any>;
	}[] = [];

	apiBodyRows.forEach((row) => {
		// Create a base payload from the current state of apiBodyRows
		const basePayload: Record<string, any> = {};
		apiBodyRows.forEach((r) => {
			basePayload[r.id] = r.value;
		});

		row.testCases.forEach((testCaseName) => {
			const modifiedPayload = { ...basePayload };

			// 5. Find the full test case from our state to get its value
			const fullTestCase = testCases.find((tc) => tc.case === testCaseName);

			// Apply the specific test case value to the current row's field
			// If the test case is somehow not found, it gracefully falls back to the original value
			modifiedPayload[row.id] = fullTestCase ? fullTestCase.value : row.value;

			testCasePayloads.push({
				field: row.id,
				testCase: testCaseName,
				payload: modifiedPayload,
			});
		});
	});

	if (testCasePayloads.length === 0) {
		return (
			<p className="min-h-[480px]">No test cases have been selected yet.</p>
		);
	}

	return (
		<div className=" min-h-[480px] flex flex-col space-y-4">
			<div className="flex h-full justify-end items-center mt-1">
				<Button onClick={() => router.push(`${pathname}/monitoring`)}>
					Run All <Play className="ml-2 h-4 w-4" />
				</Button>
			</div>
			<div className="flex flex-col items-center gap-6">
				{testCasePayloads.map((testCase, index) => (
					<Card
						key={`${testCase.field}-${testCase.testCase}-${index}`}
						className="break-all w-full"
					>
						<CardHeader className="flex flex-row justify-between items-start">
							<div className="space-y-4 w-full">
								<CardTitle className="text-md">
									Field :{" "}
									<Badge variant="secondary">
										<p className="text-[#006FEE] text-[14px]">
											{testCase.field}
										</p>
									</Badge>
								</CardTitle>
								<CardTitle className="text-md">
									Scenario :{" "}
									<Badge variant="default">
										<p className="text-xs">{testCase.testCase}</p>
									</Badge>
								</CardTitle>
								<CardTitle className="text-md">Request Body :</CardTitle>
							</div>
							<Button
								className="ml-4"
								onClick={() => router.push(`${pathname}/monitoring`)}
							>
								Run <Play className="ml-2 h-4 w-4" />
							</Button>
						</CardHeader>
						<CardContent>
							<pre className="bg-gray-100 p-3 rounded-md text-sm overflow-auto">
								<code>{JSON.stringify(testCase.payload, null, 2)}</code>
							</pre>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
};
