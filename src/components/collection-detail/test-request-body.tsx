"use client";
import React from "react";
import { useApiBodyStore } from "@/store/body-api-slice";
import { generateValueForTestCase } from "@/lib/constants";
import { Play } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

export const TestRequestBody = () => {
	const { apiBodyRows } = useApiBodyStore();

	// Generate all test case payloads
	const testCasePayloads: {
		field: string;
		testCase: string;
		payload: Record<string, any>;
	}[] = [];

	const router = useRouter();
	const pathname = usePathname();

	apiBodyRows.forEach((row) => {
		// Create a base payload from the current state of apiBodyRows
		const basePayload: Record<string, any> = {};
		apiBodyRows.forEach((r) => {
			basePayload[r.id] = r.value;
		});

		row.testCases.forEach((testCase) => {
			const modifiedPayload = { ...basePayload };
			// Apply the specific test case modification to the current row's field
			modifiedPayload[row.id] = generateValueForTestCase(
				row.value,
				row.dataType,
				testCase
			);

			testCasePayloads.push({
				field: row.id,
				testCase: testCase,
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
					Run All <Play />
				</Button>
			</div>
			<div className="flex flex-col items-center gap-6">
				{testCasePayloads.map((testCase, index) => (
					<Card
						key={`${testCase.field}-${testCase.testCase}-${index}`}
						className="break-all w-full"
					>
						<CardHeader className="flex justify-between items-start">
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
							<Button onClick={() => router.push(`${pathname}/monitoring`)}>
								Run <Play />
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
