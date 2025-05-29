"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { useParamsApiStore } from "@/store/params-api-slice";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ValidTestCase {
	key: string;
	testCase: string;
	type: "path" | "query";
	value: any;
	variableIndex: number;
}

export default function TestRequest() {
	const { pathVariables, queryParams } = useParamsApiStore();

	const baseUrl = "http://localhost:8000/api/v1/habits";

	// Helper to filter valid test cases
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

	// Get valid test cases from both sources
	const validTestCases: ValidTestCase[] = [
		...getValidTestCases(pathVariables, "path"),
		...getValidTestCases(queryParams, "query"),
	];

	console.log(validTestCases);

	// State per test case
	const [scenarios, setScenarios] = useState<Record<string, string>>({});
	const [inputs, setInputs] = useState<Record<string, string>>({});

	const handleRun = (type: string, varIndex: number, testCase: string) => {
		const inputValue = inputs[`${type}-${varIndex}-${testCase}`] || testCase;
		const isValid = inputValue.trim() === "";
		setScenarios((prev) => ({
			...prev,
			[`${type}-${varIndex}-${testCase}`]: isValid ? "Undefined" : "Defined",
		}));
	};

	const handleChange = (
		type: string,
		varIndex: number,
		testCase: string,
		value: string
	) => {
		setInputs((prev) => ({
			...prev,
			[`${type}-${varIndex}-${testCase}`]: value,
		}));
	};

	if (validTestCases.length === 0) {
		return (
			<div className="w-full max-w-2xl p-6 text-center">
				<p className="text-gray-500">
					No valid test cases available. Please provide key and value for each
					variable.
				</p>
			</div>
		);
	}

	return (
		<>
			<div className=" min-h-[480px] flex flex-col space-y-4">
				<div className="flex h-full justify-end items-center mt-1">
					<Button>
						Run All <Play />
					</Button>
				</div>
				<div className="flex flex-col items-center gap-6">
					{validTestCases.map((testcase, idx) => {
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
									<Button>
										Run <Play />
									</Button>
								</CardHeader>
								<CardContent>
									<pre className="bg-gray-100 p-3 rounded-md text-sm overflow-auto"></pre>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</>
	);
}
