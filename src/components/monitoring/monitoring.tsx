"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTestRunStore } from "@/store/test-run-slice";
import { transformBackendData } from "./data-transformer";
import type { TestResult } from "@/types/monitoring-type";
import { Button } from "@/components/ui/button";
import { ProgressMonitoring } from "./progress";
import { RequestMetadataWithLogs } from "./request-metadata-with-logs";
import { MonitoringData } from "./monitoring-data";
import Link from "next/link";

export default function Monitoring() {
	const { testRunResult, setTestRunResult, clearTestRunResult } =
		useTestRunStore();

	const [testResults, setTestResults] = useState<TestResult[]>([]);
	const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);
	const [currentExecutingIndex, setCurrentExecutingIndex] = useState(-1);
	const executionTimeouts = useRef<NodeJS.Timeout[]>([]);

	// ✨ This useEffect is now corrected to run only once on mount.
	useEffect(() => {
		// We read the initial state from the store here.
		let dataToProcess = testRunResult;

		// If the store is empty (due to race condition), check sessionStorage
		if (!dataToProcess) {
			const storedResult = sessionStorage.getItem("testRunResult");
			if (storedResult) {
				dataToProcess = JSON.parse(storedResult);
				// Put the data back into the store so the app is consistent
				setTestRunResult(dataToProcess!);
				// Clean up sessionStorage immediately after use
				sessionStorage.removeItem("testRunResult");
			}
		}

		if (dataToProcess) {
			setIsExecuting(true);
			setCurrentExecutingIndex(-1);

			const finalResults = transformBackendData([dataToProcess]);
			const pendingResults = finalResults.map((test) => ({
				...test,
				status: "pending" as const,
			}));
			setTestResults(pendingResults);
			// This is the only time startTestExecution should be called.
			startTestExecution(finalResults);
		}

		// The cleanup function remains the same. It will run when you navigate away.
		return () => {
			clearTestRunResult();
			executionTimeouts.current.forEach((timeout) => clearTimeout(timeout));
		};
	}, [setTestRunResult, clearTestRunResult]);

	const startTestExecution = (finalResults: TestResult[]) => {
		executionTimeouts.current.forEach((timeout) => clearTimeout(timeout));
		executionTimeouts.current = [];

		finalResults.forEach((finalTest, index) => {
			const startTimeout = setTimeout(() => {
				setCurrentExecutingIndex(index);
				// Using the functional update form is great practice here!
				setTestResults((prev) =>
					prev.map((test, i) =>
						i === index ? { ...test, status: "loading" as const } : test
					)
				);

				const completeTimeout = setTimeout(() => {
					setTestResults((prev) =>
						prev.map((test, i) => (i === index ? finalTest : test))
					);
					if (index === 0) {
						setSelectedTestId(finalTest.id);
					}
					if (index === finalResults.length - 1) {
						setIsExecuting(false);
						setCurrentExecutingIndex(-1);
					}
				}, 1000); // 1-second interval for each test completion

				executionTimeouts.current.push(completeTimeout);
			}, index * 1000); // 1-second delay between each test start

			executionTimeouts.current.push(startTimeout);
		});
	};

	// The rest of your component logic and JSX is correct.
	const handleTestSelect = (testId: string) => {
		const test = testResults.find((t) => t.id === testId);
		if (test && (test.status === "passed" || test.status === "failed")) {
			setSelectedTestId(testId);
		}
	};

	const totalTests = testResults.length;
	const passedTests = testResults.filter(
		(test) => test.status === "passed"
	).length;
	const failedTests = testResults.filter(
		(test) => test.status === "failed"
	).length;
	const loadingTests = testResults.filter(
		(test) => test.status === "loading"
	).length;
	const completedTests = passedTests + failedTests;
	const selectedTest = testResults.find((test) => test.id === selectedTestId);

	if (testResults.length === 0 && !isExecuting) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
				<p className="text-2xl font-bold text-gray-800">
					No test run data found.
				</p>
				<p className="text-gray-500 mt-2">
					Please start a new test run from the request page.
				</p>
				<Link href="/projects">
					<Button className="mt-6">Go Back to Projects</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="w-full mt-10 bg-white rounded-xl shadow p-8 space-y-8 px-20">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<p className="text-3xl font-bold text-gray-900">Test Pilot API</p>
					{testRunResult && (
						<p className="text-[#71717A]">
							{new Date(testRunResult.startTimestamp).toLocaleDateString(
								"en-US",
								{ day: "2-digit", month: "short", year: "numeric" }
							)}
							,{" "}
							{new Date(testRunResult.startTimestamp).toLocaleTimeString(
								"en-US",
								{ hour: "2-digit", minute: "2-digit", hour12: true }
							)}
						</p>
					)}
				</div>
				<div className="flex items-center gap-4">
					<div className="text-[#71717A]">
						{completedTests}/{totalTests || "..."} requests completed
					</div>
				</div>
			</div>

			{/* Test Summary */}
			<div className="flex justify-around">
				<div className="text-center">
					<p className="text-4xl font-semibold">{totalTests || "0"}</p>
					<p className="text-[#94A3B8]">Total Test</p>
				</div>
				<div className="text-center">
					<p className="text-4xl font-semibold text-[#17C964]">{passedTests}</p>
					<p className="text-[#94A3B8]">Passed</p>
				</div>
				<div className="text-center">
					<p className="text-4xl font-semibold text-[#EF4444]">{failedTests}</p>
					<p className="text-[#94A3B8]">Failed</p>
				</div>
				{loadingTests > 0 && (
					<div className="text-center">
						<p className="text-4xl font-semibold text-[#F59E0B]">
							{loadingTests}
						</p>
						<p className="text-[#94A3B8]">Running</p>
					</div>
				)}
			</div>

			{/* Execution Summary */}
			<div className="space-y-8">
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<p className="text-2xl font-semibold">Executed Request</p>
						{isExecuting && currentExecutingIndex >= 0 && (
							<p className="text-sm text-[#F59E0B]">
								Executing test {currentExecutingIndex + 1} of {totalTests}...
							</p>
						)}
					</div>
					<div className="flex justify-between">
						<p className="text-[#94A3B8]">
							Status: {isExecuting ? "running" : "completed"}
						</p>
						<p className="text-[#94A3B8]">
							{passedTests}/{totalTests || "0"} Passed
						</p>
					</div>
					<ProgressMonitoring completed={completedTests} total={totalTests} />
				</div>

				{/* Request Detail Section */}
				<div className="grid grid-cols-12 gap-8">
					<div className="space-y-8 col-span-5 border-r pr-8">
						{selectedTest ? (
							<RequestMetadataWithLogs selectedTest={selectedTest} />
						) : (
							<div className="flex items-center justify-center h-64 text-[#94A3B8]">
								<p>Select a test to view its details.</p>
							</div>
						)}
					</div>
					<div className="col-span-7">
						<MonitoringData
							testResults={testResults}
							onSelectTest={handleTestSelect}
							selectedTestId={selectedTestId}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
