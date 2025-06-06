"use client";
import React, { useState } from "react";
import { useApiBodyStore } from "@/store/body-api-slice";
import { generateValueForTestCase } from "@/lib/constants";
import { Play, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

export const TestRequestBody = () => {
	const { apiBodyRows } = useApiBodyStore();
	const router = useRouter();
	const pathname = usePathname();

	const [isRunAllLoading, setIsRunAllLoading] = useState(false);
	// State for individual "Run" button loading status
	// We'll use an object to track loading state by a unique key for each card
	const [individualRunLoading, setIndividualRunLoading] = useState<
		Record<string, boolean>
	>({});

	const testCasePayloads: {
		key: string; // Unique key for each test case payload
		field: string;
		testCase: string;
		payload: Record<string, any>;
	}[] = [];

	apiBodyRows.forEach((row, rowIndex) => {
		const basePayload: Record<string, any> = {};
		apiBodyRows.forEach((r) => {
			basePayload[r.id] = r.value;
		});

		row.testCases.forEach((testCase, caseIndex) => {
			const modifiedPayload = { ...basePayload };
			modifiedPayload[row.id] = generateValueForTestCase(
				row.value,
				row.dataType,
				testCase
			);
			// Create a unique key for this specific test case payload
			const uniqueKey = `${row.id}-${testCase}-${rowIndex}-${caseIndex}`;
			testCasePayloads.push({
				key: uniqueKey,
				field: row.id,
				testCase: testCase,
				payload: modifiedPayload,
			});
		});
	});

	const handleRunAllClick = () => {
		if (testCasePayloads.length === 0) return;
		setIsRunAllLoading(true);
		setTimeout(() => {
			setIsRunAllLoading(false);
			router.push(`${pathname}/monitoring`);
		}, 3000); // 3-second delay for Run All
	};

	// Handler for individual "Run" button clicks
	const handleIndividualRunClick = (testCaseKey: string) => {
		setIndividualRunLoading((prev) => ({ ...prev, [testCaseKey]: true })); // Start loading for this specific test case

		// Simulate a 2-second delay
		setTimeout(() => {
			setIndividualRunLoading((prev) => ({ ...prev, [testCaseKey]: false })); // Stop loading
			// Navigate to the monitoring page. You might want to pass which specific test case was run.
			// For now, it navigates to the same general monitoring page.
			router.push(`${pathname}/monitoring`);
		}, 2000); // 2-second delay for individual run
	};

	if (testCasePayloads.length === 0) {
		return (
			<p className="min-h-[480px]">No test cases have been selected yet.</p>
		);
	}

	return (
		<div className=" min-h-[480px] flex flex-col space-y-4">
			<div className="flex h-full justify-end items-center mt-1">
				<Button
					onClick={handleRunAllClick}
					disabled={
						isRunAllLoading ||
						Object.values(individualRunLoading).some((loading) => loading)
					} // Also disable if any individual test is running
					className="cursor-pointer"
				>
					{isRunAllLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Running All...
						</>
					) : (
						<>
							Run All <Play className="ml-2 h-4 w-4" />
						</>
					)}
				</Button>
			</div>
			<div className="flex flex-col items-center gap-6">
				{testCasePayloads.map(
					(
						testCaseItem // Changed variable name for clarity
					) => (
						<Card
							key={testCaseItem.key} // Use the generated unique key
							className="break-all w-full"
						>
							<CardHeader className="flex flex-row justify-between items-start">
								<div className="space-y-4 w-full">
									<CardTitle className="text-md">
										Field :{" "}
										<Badge variant="secondary">
											<p className="text-[#006FEE] text-[14px]">
												{testCaseItem.field}
											</p>
										</Badge>
									</CardTitle>
									<CardTitle className="text-md">
										Scenario :{" "}
										<Badge variant="default">
											<p className="text-xs">{testCaseItem.testCase}</p>
										</Badge>
									</CardTitle>
									<CardTitle className="text-md">Request Body :</CardTitle>
								</div>
								<Button
									onClick={() => handleIndividualRunClick(testCaseItem.key)}
									disabled={
										isRunAllLoading || individualRunLoading[testCaseItem.key]
									}
									className="cursor-pointer ml-4 flex-shrink-0"
								>
									{individualRunLoading[testCaseItem.key] ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Running...
										</>
									) : (
										<>
											Run <Play className="ml-1 h-4 w-4" />
										</>
									)}
								</Button>
							</CardHeader>
							<CardContent>
								<pre className="bg-gray-100 p-3 rounded-md text-sm overflow-auto">
									<code>{JSON.stringify(testCaseItem.payload, null, 2)}</code>
								</pre>
							</CardContent>
						</Card>
					)
				)}
			</div>
		</div>
	);
};
