"use client";

import React, { useState } from "react";
import { useApiBodyStore } from "@/store/body-api-slice";
// Make sure to import the new functions from your utility file
import { convertCustomValue, jsonStringifyWithTruncation } from "@/lib/utils";
import { Play, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { generateValueForTestCase } from "@/lib/constants";
import useTestCaseStore from "@/store/test-case-store";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

export const TestRequestBody = () => {
	const { apiBodyRows } = useApiBodyStore();
	const router = useRouter();
	const pathname = usePathname();

	// --- 2. Get the custom test cases from the store ---
	const { customTestCases } = useTestCaseStore();

	const [isRunAllLoading, setIsRunAllLoading] = useState(false);
	const [individualRunLoading, setIndividualRunLoading] = useState<
		Record<string, boolean>
	>({});

	const testCasePayloads: {
		key: string;
		field: string;
		testCase: string;
		payload: Record<string, any>;
	}[] = [];

	apiBodyRows.forEach((row, rowIndex) => {
		const basePayload: Record<string, any> = {};
		apiBodyRows.forEach((r) => {
			basePayload[r.id] = r.value;
		});

		row.testCases.forEach((testCaseName, caseIndex) => {
			const modifiedPayload = { ...basePayload };
			let generatedValue;

			// --- 3. NEW LOGIC: Prioritize custom cases ---
			// First, check if the test case exists in our custom list
			const customCase = customTestCases.find((c) => c.name === testCaseName);

			if (customCase) {
				generatedValue = convertCustomValue(customCase.value, customCase.type);
			} else {
				generatedValue = generateValueForTestCase(
					row.value,
					row.dataType,
					testCaseName
				);
			}

			modifiedPayload[row.id] = generatedValue;

			const uniqueKey = `${row.id}-${testCaseName}-${rowIndex}-${caseIndex}`;
			testCasePayloads.push({
				key: uniqueKey,
				field: row.id,
				testCase: testCaseName,
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
		}, 3000);
	};

	const handleIndividualRunClick = (testCaseKey: string) => {
		setIndividualRunLoading((prev) => ({ ...prev, [testCaseKey]: true }));
		setTimeout(() => {
			setIndividualRunLoading((prev) => ({ ...prev, [testCaseKey]: false }));
			router.push(`${pathname}/monitoring`);
		}, 2000);
	};

	if (testCasePayloads.length === 0) {
		return (
			<div className="flex items-center justify-center p-4 text-center text-muted-foreground min-h-[480px]">
				No test cases have been selected yet.
			</div>
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
					}
					className="cursor-pointer text-[15px]"
				>
					{isRunAllLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Running All...
						</>
					) : (
						<>
							Run All ({testCasePayloads.length}){" "}
							<Play className="ml-2 h-4 w-4" />
						</>
					)}
				</Button>
			</div>
			<div className="flex flex-col items-center gap-6 text-[20px]">
				{testCasePayloads.map((testCaseItem) => (
					<Card key={testCaseItem.key} className="break-all w-full shadow-sm">
						<CardHeader className="flex flex-row justify-between items-start">
							<div className="space-y-4 w-full">
								<CardTitle className="text-md font-medium">
									Field :{" "}
									<Badge variant="secondary" className="text-lg">
										{testCaseItem.field}
									</Badge>
								</CardTitle>
								<CardTitle className="text-md font-medium">
									Scenario :{" "}
									<Badge variant="default" className="text-lg">
										{testCaseItem.testCase}
									</Badge>
								</CardTitle>
								<CardTitle className="text-md font-medium">
									Request Body :
								</CardTitle>
							</div>
							<Button
								onClick={() => handleIndividualRunClick(testCaseItem.key)}
								disabled={
									isRunAllLoading || individualRunLoading[testCaseItem.key]
								}
								className="cursor-pointer ml-4 flex-shrink-0 text-[15px]"
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
							<SyntaxHighlighter
								language="json"
								style={atomOneLight}
								wrapLongLines={true}
								showLineNumbers
								customStyle={{
									margin: 0,
									padding: "16px",
									height: "100%",
									fontSize: "18px",
									borderRadius: "10px",
									whiteSpace: "pre-wrap",
									wordBreak: "break-all",
								}}
								codeTagProps={{
									style: {
										fontFamily: '"JetBrains Mono", monospace',
									},
								}}
							>
								{JSON.stringify(testCaseItem.payload, null, 2)}
							</SyntaxHighlighter>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
};
