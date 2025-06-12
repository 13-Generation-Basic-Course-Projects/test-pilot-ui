"use client";
import React, { useState, useEffect } from "react";
import { useApiBodyStore } from "@/store/body-api-slice";
import { Play } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { getAllPredefinedAction } from "@/action/pre-defined-action";
import { Skeleton } from "@/components/ui/skeleton";

interface TestCase {
	type: string;
	case: string;
	value: any;
}

export const TestRequestBody = () => {
	const { apiBodyRows } = useApiBodyStore();
	const router = useRouter();
	const pathname = usePathname();

	const [testCases, setTestCases] = useState<TestCase[]>([]);
	// 2. Add the isLoading state
	const [isLoading, setIsLoading] = useState(true);

	// 3. Update useEffect to manage the loading state
	useEffect(() => {
		const fetchTestCases = async () => {
			setIsLoading(true);
			try {
				const backendData = await getAllPredefinedAction();
				if (backendData && Array.isArray(backendData)) {
					const transformedData: TestCase[] = backendData.map((item: any) => ({
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

	const testCasePayloads: {
		field: string;
		testCase: string;
		payload: Record<string, any>;
	}[] = [];

	if (!isLoading) {
		apiBodyRows.forEach((row) => {
			const basePayload: Record<string, any> = {};
			apiBodyRows.forEach((r) => {
				basePayload[r.id] = r.value;
			});
			row.testCases.forEach((testCaseName) => {
				const modifiedPayload = { ...basePayload };
				const fullTestCase = testCases.find((tc) => tc.case === testCaseName);
				modifiedPayload[row.id] = fullTestCase ? fullTestCase.value : row.value;
				testCasePayloads.push({
					field: row.id,
					testCase: testCaseName,
					payload: modifiedPayload,
				});
			});
		});
	}

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
					onClick={() => router.push(`${pathname}/monitoring`)}
					disabled={isLoading || testCasePayloads.length === 0}
				>
					Run All <Play className="ml-2 h-4 w-4" />
				</Button>
			</div>
			<div className="flex flex-col items-center gap-6">
				{/* 4. Use conditional rendering for loading, empty, and data states */}
				{isLoading ? (
					// Display 3 skeleton cards while loading
					[...Array(3)].map((_, index) => <CardSkeleton key={index} />)
				) : testCasePayloads.length === 0 ? (
					// Display message if no test cases are selected after loading
					<p className="min-h-[480px]">No test cases have been selected yet.</p>
				) : (
					// Display the actual data cards
					testCasePayloads.map((testCase, index) => (
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
					))
				)}
			</div>
		</div>
	);
};
