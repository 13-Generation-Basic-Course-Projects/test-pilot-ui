"use client";

import { useState, useEffect } from "react";
import { MonitoringData } from "./monitoring-data";
import { RequestMetadataWithLogs } from "./request-metadata-with-logs";
import { useRequestStore } from "@/store/request-url-slice";
import { ProgressMonitoring } from "./progress";

interface TestProgress {
	completed: number;
	total: number;
	currentTest: number;
}

interface TestResult {
	id: number;
	testName: string;
	status: "pending" | "loading" | "passed" | "failed";
	date: string;
	method: string;
	endpoint: string;
	httpStatus: number;
	statusText: string;
	metadata: any;
	logs: Array<{
		level: "INFO" | "WARNING" | "ERROR" | "DEBUG";
		message: string;
		source?: string;
	}>;
}

export default function Monitoring() {
	const { method: userMethod, url: userUrl } = useRequestStore();

	const [testProgress, setTestProgress] = useState<TestProgress>({
		completed: 0,
		total: 4,
		currentTest: 0,
	});

	const [testResults, setTestResults] = useState<TestResult[]>([
		{
			id: 1,
			testName: "Response Time Check",
			status: "pending",
			date: "2025-05-20",
			method: userMethod || "GET",
			endpoint: userUrl || "http://localhost:8080/api/v1/habits",
			httpStatus: 200,
			statusText: "OK",
			metadata: {
				headers: {
					"Content-Type": "application/json",
					"User-Agent": "TestPilot/1.0",
				},
				timestamp: "2025-05-20T19:00:00Z",
			},
			logs: [
				{
					level: "INFO",
					message: "Starting Response Time Check",
					source: "TestRunner",
				},
				{
					level: "INFO",
					message: "Connecting to API endpoint",
					source: "HttpClient",
				},
				{
					level: "INFO",
					message: `Sending ${userMethod || "GET"} request to ${
						userUrl || "/api/v1/habits"
					}`,
					source: "HttpClient",
				},
				{
					level: "INFO",
					message: "Response received: 200 OK",
					source: "HttpClient",
				},
				{
					level: "DEBUG",
					message: "Response time: 120ms",
					source: "TestRunner",
				},
				{
					level: "INFO",
					message: "Test passed: Response Time Check (120ms < 200ms)",
					source: "TestRunner",
				},
			],
		},
		{
			id: 2,
			testName: "Status Code Validation",
			status: "pending",
			date: "2025-05-20",
			method: userMethod || "POST",
			endpoint: userUrl || "http://localhost:8080/api/v1/habits",
			httpStatus: 200,
			statusText: "OK",
			metadata: {
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer ***",
					"User-Agent": "TestPilot/1.0",
				},
				body: {
					name: "Morning Exercise",
					frequency: "daily",
					target: 30,
				},
				timestamp: "2025-05-20T19:00:05Z",
			},
			logs: [
				{
					level: "INFO",
					message: "Starting Status Code Validation",
					source: "TestRunner",
				},
				{
					level: "INFO",
					message: "Connecting to API endpoint",
					source: "HttpClient",
				},
				{
					level: "INFO",
					message: `Sending ${userMethod || "POST"} request to ${
						userUrl || "/api/v1/habits"
					}`,
					source: "HttpClient",
				},
				{
					level: "DEBUG",
					message: "Request body serialized: 128 bytes",
					source: "HttpClient",
				},
				{
					level: "INFO",
					message: "Response received: 200 OK",
					source: "HttpClient",
				},
				{
					level: "ERROR",
					message: "Expected status code 201, got 200",
					source: "TestRunner",
				},
				{
					level: "ERROR",
					message: "Test failed: Status Code Validation",
					source: "TestRunner",
				},
			],
		},
		{
			id: 3,
			testName: "Response Schema",
			status: "pending",
			date: "2025-05-20",
			method: userMethod || "PUT",
			endpoint: userUrl || "http://localhost:8080/api/v1/habits",
			httpStatus: 200,
			statusText: "OK",
			metadata: {
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer ***",
					"User-Agent": "TestPilot/1.0",
				},
				body: {
					name: "Evening Meditation",
					frequency: "daily",
					target: 15,
				},
				timestamp: "2025-05-20T19:00:10Z",
			},
			logs: [
				{
					level: "INFO",
					message: "Starting Response Schema Test",
					source: "TestRunner",
				},
				{
					level: "INFO",
					message: "Connecting to API endpoint",
					source: "HttpClient",
				},
				{
					level: "INFO",
					message: `Sending ${userMethod || "PUT"} request to ${
						userUrl || "/api/v1/habits"
					}`,
					source: "HttpClient",
				},
				{
					level: "INFO",
					message: "Response received: 200 OK",
					source: "HttpClient",
				},
				{
					level: "INFO",
					message: "Validating response schema",
					source: "SchemaValidator",
				},
				{
					level: "WARNING",
					message: "Schema validation found issues",
					source: "SchemaValidator",
				},
				{
					level: "ERROR",
					message: "Missing required field: id",
					source: "SchemaValidator",
				},
				{
					level: "ERROR",
					message: "Test failed: Response Schema",
					source: "TestRunner",
				},
			],
		},
		{
			id: 4,
			testName: "Authentication Check",
			status: "pending",
			date: "2025-05-20",
			method: userMethod || "DELETE",
			endpoint: userUrl || "http://localhost:8080/api/v1/habits",
			httpStatus: 204,
			statusText: "No Content",
			metadata: {
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer valid_token_123",
					"User-Agent": "TestPilot/1.0",
				},
				timestamp: "2025-05-20T19:00:15Z",
			},
			logs: [
				{
					level: "INFO",
					message: "Starting Authentication Check",
					source: "TestRunner",
				},
				{
					level: "INFO",
					message: "Connecting to API endpoint",
					source: "HttpClient",
				},
				{
					level: "INFO",
					message: `Sending ${userMethod || "DELETE"} request to ${
						userUrl || "/api/v1/habits"
					}`,
					source: "HttpClient",
				},
				{
					level: "DEBUG",
					message: "Authorization header set",
					source: "HttpClient",
				},
				{
					level: "INFO",
					message: "Response received: 204 No Content",
					source: "HttpClient",
				},
				{
					level: "INFO",
					message: "Validating authentication token",
					source: "AuthValidator",
				},
				{
					level: "DEBUG",
					message: "Token validation successful",
					source: "AuthValidator",
				},
				{
					level: "INFO",
					message: "Test passed: Authentication Check",
					source: "TestRunner",
				},
			],
		},
	]);

	const [selectedTestId, setSelectedTestId] = useState<number | null>(null);

	// Update test results when user changes method or URL
	useEffect(() => {
		setTestResults((prev) =>
			prev.map((test) => ({
				...test,
				method: userMethod,
				endpoint: userUrl || "http://localhost:8080/api/v1/habits",
				logs: test.logs.map((log) =>
					log.message.includes("Sending")
						? {
								...log,
								message: `Sending ${userMethod} request to ${
									userUrl || "/api/v1/habits"
								}`,
						  }
						: log
				),
			}))
		);
	}, [userMethod, userUrl]);

	// Simulate test execution progression
	useEffect(() => {
		const testSequence = [
			{ id: 1, status: "passed" as const },
			{ id: 2, status: "failed" as const },
			{ id: 3, status: "failed" as const },
			{ id: 4, status: "passed" as const },
		];

		let currentIndex = 0;

		const executeNextTest = () => {
			if (currentIndex < testSequence.length) {
				const testToUpdate = testSequence[currentIndex];
				const testId = testToUpdate.id;

				// First set to loading
				setTestResults((prev) =>
					prev.map((test) =>
						test.id === testId ? { ...test, status: "loading" as const } : test
					)
				);

				// Then complete after delay
				setTimeout(() => {
					setTestResults((prev) =>
						prev.map((test) =>
							test.id === testId
								? {
										...test,
										status: testToUpdate.status,
								  }
								: test
						)
					);

					setTestProgress((prev) => ({
						...prev,
						completed: prev.completed + 1,
						currentTest: currentIndex + 1,
					}));

					// Auto-select the first completed test
					if (selectedTestId === null && currentIndex === 0) {
						setSelectedTestId(testId);
					}

					currentIndex++;

					// Schedule next test
					if (currentIndex < testSequence.length) {
						setTimeout(executeNextTest, Math.random() * 1000 + 500);
					}
				}, Math.random() * 2000 + 1000); // 1-3 seconds for test execution
			}
		};

		// Start first test after initial delay
		const initialTimer = setTimeout(executeNextTest, 1000);

		return () => clearTimeout(initialTimer);
	}, []);

	const passedTests = testResults.filter(
		(test) => test.status === "passed"
	).length;
	const failedTests = testResults.filter(
		(test) => test.status === "failed"
	).length;

	const handleTestSelect = (testId: number) => {
		const test = testResults.find((t) => t.id === testId);
		// Only allow selection of completed tests
		if (test && (test.status === "passed" || test.status === "failed")) {
			setSelectedTestId(testId);
		}
	};

	// Find the selected test or default to the first completed one
	const selectedTest =
		testResults.find((test) => test.id === selectedTestId) ||
		testResults.find(
			(test) => test.status === "passed" || test.status === "failed"
		);

	return (
		<div className="w-full mt-10 bg-white rounded-xl shadow p-8 space-y-8 px-20">
			{/* Header */}
			<div className="flex justify-between">
				<div>
					<p className="text-3xl font-bold text-gray-900">Test Pilot API</p>
					<p className="text-[#71717A]">20 May 2025, 19:00PM</p>
				</div>
				<div className="text-[#71717A]">
					{testProgress.completed}/{testProgress.total} request completed
				</div>
			</div>

			{/* Test Summary */}
			<div className="flex justify-center space-x-50">
				<div className="text-center">
					<p className="text-4xl font-semibold">{testProgress.total}</p>
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
			</div>

			{/* Execution Summary */}
			<div className="space-y-8">
				<div className="space-y-4">
					<p className="text-2xl font-semibold">Executed Request</p>
					<div className="flex justify-between">
						<p className="text-[#94A3B8]">
							Status:{" "}
							{testProgress.completed === testProgress.total
								? "completed"
								: "running"}
						</p>
						<p className="text-[#94A3B8]">
							{passedTests}/{testProgress.total} Passed
						</p>
					</div>
					<ProgressMonitoring
						completed={testProgress.completed}
						total={testProgress.total}
					/>
				</div>

				{/* Request Detail Section */}
				<div className="grid grid-cols-12 gap-8">
					{/* Left Panel: Request Info + Logs + Metadata */}
					<div className="space-y-8 col-span-5 border-r pr-8">
						{selectedTest ? (
							<>
								<div className="space-y-4">
									<div className="flex space-x-2">
										<p>Status:</p>
										<div
											className={`border border-[#E2E8F0] rounded-md px-[10px] ${
												selectedTest.httpStatus === 200 ||
												selectedTest.httpStatus === 204
													? "text-[#17C964]"
													: "text-[#EF4444]"
											}`}
										>
											{selectedTest.httpStatus} {selectedTest.statusText}
										</div>
									</div>
									<div className="flex space-x-2">
										<p>Method:</p>
										<div
											className={`border border-[#E2E8F0] rounded-md px-[15px] ${
												selectedTest.method === "GET"
													? "text-[#3B82F6]"
													: selectedTest.method === "POST"
													? "text-[#10B981]"
													: selectedTest.method === "PUT"
													? "text-[#006FEE]"
													: selectedTest.method === "DELETE"
													? "text-[#EF4444]"
													: "text-[#8B5CF6]"
											}`}
										>
											{selectedTest.method}
										</div>
									</div>
									<div className="flex space-x-2 items-end">
										<p>Endpoint:</p>
										<p className="text-[#475569] font-mono text-sm line-clamp-1">
											{selectedTest.endpoint}
										</p>
									</div>
								</div>

								<hr className="text-[#94A3B8]" />

								<RequestMetadataWithLogs selectedTest={selectedTest} />
							</>
						) : (
							<div className="flex items-center justify-center h-64 text-[#94A3B8]">
								<p>Select a completed test to view details</p>
							</div>
						)}
					</div>

					{/* Right Panel: Monitoring Table */}
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
