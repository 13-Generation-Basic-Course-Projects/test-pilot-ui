"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Play } from "lucide-react";
import { useParamsApiStore } from "@/store/params-api-slice";
import { Card } from "./ui/card";

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
	const validTestCases = [
		...getValidTestCases(pathVariables, "path"),
		...getValidTestCases(queryParams, "query"),
	];

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
		<div className="w-full max-w-2xl space-y-6">
			{/* Run All Button */}
			<div className="flex justify-end">
				<Button
					onClick={() =>
						validTestCases.forEach(({ type, variableIndex, testCase }) =>
							handleRun(type, variableIndex, testCase)
						)
					}
					className="bg-black text-white"
				>
					Run All <Play className="ml-1 h-4 w-4" />
				</Button>
			</div>

			{/* Render one card per valid test case */}
			{validTestCases.map(
				({ type, key, value, variableIndex, testCase }, idx) => {
					const isPathParam = type === "path";
					return (
						<Card key={idx} className="border rounded-md p-4 space-y-4">
							{/* Type badge */}
							<div className="flex justify-between items-center">
								<Badge
									variant="outline"
									className={isPathParam ? "text-blue-500" : "text-purple-500"}
								>
									{isPathParam ? "Path Variable" : "Query Param"}
								</Badge>
							</div>

							{/* Key & Value Display */}
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<span className="font-medium text-sm text-gray-500">
										Key:
									</span>
									<Badge variant="outline">{key}</Badge>
								</div>
								<div className="flex items-center gap-2">
									<span className="font-medium text-sm text-gray-500">
										Value:
									</span>
									<Badge
										variant="outline"
										className="bg-green-50 text-green-700"
									>
										{value}
									</Badge>
								</div>
							</div>

							{/* Test Case + Run */}
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<span className="font-medium">Test Case:</span>
									<Badge variant="outline" className="text-blue-500">
										{testCase}
									</Badge>
								</div>
								<Button
									onClick={() => handleRun(type, variableIndex, testCase)}
									className="bg-black text-white"
								>
									Run <Play className="ml-1 h-4 w-4" />
								</Button>
							</div>

							{/* Scenario Result */}
							<div className="flex items-center gap-2">
								<span className="font-medium">Scenario:</span>
								<Badge className="bg-gray-800 text-white rounded-full px-3 py-1 text-xs">
									{scenarios[`${type}-${variableIndex}-${testCase}`] ??
										"Undefined"}
								</Badge>
							</div>

							{/* Input Field */}
							<div>
								<p className="mb-1 font-medium">
									Request {isPathParam ? "Path" : "Query"} Value:
								</p>
								<Input
									placeholder={
										isPathParam
											? `${baseUrl}/your-path-variable`
											: `?${key}=your-query-value`
									}
									value={inputs[`${type}-${variableIndex}-${testCase}`] || ""}
									onChange={(e) =>
										handleChange(type, variableIndex, testCase, e.target.value)
									}
								/>
							</div>
						</Card>
					);
				}
			)}
		</div>
	);
}
