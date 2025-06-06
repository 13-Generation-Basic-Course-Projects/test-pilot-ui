"use client";

import { useState, useEffect } from "react";
import { MonitoringData } from "./monitoring-data";
import { RequestMetadataWithLogs } from "./request-metadata-with-logs";
import { ProgressMonitoring } from "./progress";
import { LiveLogConsole } from "./live-log-console";
import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "@/components/ui/resizable";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";

interface TestProgress {
	completed: number;
	total: number;
	currentTest: number;
}

interface LogEntry {
	timestamp: string;
	level: "INFO" | "WARNING" | "ERROR" | "DEBUG";
	message: string;
	source?: string;
	testId?: number;
	testName?: string;
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
	const [testProgress, setTestProgress] = useState<TestProgress>({
		completed: 0,
		total: 4,
		currentTest: 0,
	});

	const [allLogs, setAllLogs] = useState<LogEntry[]>([]);
	const [logsModalOpen, setLogsModalOpen] = useState(false);

	const [testResults, setTestResults] = useState<TestResult[]>([
		{
			id: 1,
			testName: "Response Time Check",
			status: "pending",
			date: "2025-05-20",
			method: "GET",
			endpoint: "http://localhost:8080/api/v1/habits",
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
					message: "Sending GET request to /api/v1/habits",
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
			method: "POST",
			endpoint: "http://localhost:8080/api/v1/habits",
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
					message: "Sending POST request to /api/v1/habits",
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
			method: "PUT",
			endpoint: "http://localhost:8080/api/v1/habits",
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
					message: "Sending PUT request to /api/v1/habits",
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
			method: "DELETE",
			endpoint: "http://localhost:8080/api/v1/habits",
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
					message: "Sending DELETE request to /api/v1/habits",
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

	const generateTimestamp = () => {
		const now = new Date();
		return `${now.getHours().toString().padStart(2, "0")}:${now
			.getMinutes()
			.toString()
			.padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${now
			.getMilliseconds()
			.toString()
			.padStart(3, "0")}`;
	};

	const addLogEntry = (log: Omit<LogEntry, "timestamp">) => {
		setAllLogs((prev) => [
			...prev,
			{
				...log,
				timestamp: generateTimestamp(),
			},
		]);
	};

	// Simulate test execution progression
	useEffect(() => {
		const testSequence = [
			{ id: 1, status: "passed" as const },
			{ id: 2, status: "failed" as const },
			{ id: 3, status: "failed" as const },
			{ id: 4, status: "passed" as const },
		];

		let currentIndex = 0;

		// Add initial system log
		setTimeout(() => {
			addLogEntry({
				level: "INFO",
				message: "Test Pilot API initialized - Starting test execution",
				source: "System",
			});
		}, 500);

		const executeNextTest = () => {
			if (currentIndex < testSequence.length) {
				const testToUpdate = testSequence[currentIndex];
				const testId = testToUpdate.id;
				const test = testResults.find((t) => t.id === testId);

				if (test) {
					// Add test start log
					addLogEntry({
						level: "INFO",
						message: `Starting test: ${test.testName}`,
						source: "TestRunner",
						testId: testId,
						testName: test.testName,
					});

					// First set to loading
					setTestResults((prev) =>
						prev.map((test) =>
							test.id === testId
								? { ...test, status: "loading" as const }
								: test
						)
					);

					// Stream logs for this test
					const streamLogs = async () => {
						for (let i = 0; i < test.logs.length; i++) {
							await new Promise((resolve) =>
								setTimeout(resolve, Math.random() * 300 + 100)
							);
							addLogEntry({
								...test.logs[i],
								testId: testId,
								testName: test.testName,
							});
						}
					};

					streamLogs().then(() => {
						// Complete the test
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

							// Add completion log
							addLogEntry({
								level: testToUpdate.status === "passed" ? "INFO" : "ERROR",
								message: `Test ${testToUpdate.status}: ${test.testName}`,
								source: "TestRunner",
								testId: testId,
								testName: test.testName,
							});

							// Auto-select the first completed test
							if (selectedTestId === null && currentIndex === 0) {
								setSelectedTestId(testId);
							}

							currentIndex++;

							// Schedule next test
							if (currentIndex < testSequence.length) {
								setTimeout(executeNextTest, Math.random() * 1000 + 500);
							} else {
								// All tests completed
								setTimeout(() => {
									addLogEntry({
										level: "INFO",
										message: "All tests completed - Test execution finished",
										source: "System",
									});
								}, 500);
							}
						}, 500);
					});
				}
			}
		};

		// Start first test after initial delay
		const initialTimer = setTimeout(executeNextTest, 1500);

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
		<div className="w-full mt-10 bg-white rounded-xl shadow p-8 space-y-8">
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

				{/* Two Panel Resizable Layout */}
				<ResizablePanelGroup
					direction="horizontal"
					className="h-[600px] rounded-lg border"
				>
					{/* Left Panel: Live Logs + Test Details */}
					<ResizablePanel defaultSize={40} minSize={25} maxSize={70}>
						<div className="p-6 h-full flex flex-col overflow-hidden space-y-6">
							{/* Live Logs Section */}
							<div className="flex-shrink-0">
								<div className="flex justify-between items-center mb-4">
									<h3 className="text-xl font-semibold">Live Logs</h3>
									<Button
										variant="outline"
										size="sm"
										className="flex items-center gap-1"
										onClick={() => setLogsModalOpen(true)}
									>
										<Maximize2 className="h-4 w-4" />
										<span className="hidden sm:inline">Expand</span>
									</Button>
								</div>
								<div className="h-48">
									<LiveLogConsole logs={allLogs} compact={true} />
								</div>
							</div>

							{/* Separator */}
							<hr className="border-[#E2E8F0]" />

							{/* Test Details Section */}
							<div className="flex-1 overflow-hidden">
								<h3 className="text-xl font-semibold mb-4 flex-shrink-0">
									Test Details
								</h3>
								{selectedTest ? (
									<div className="space-y-4 h-full overflow-y-auto min-h-0">
										<div className="space-y-3">
											<div className="flex flex-col space-y-3">
												<div className="flex items-center space-x-2 min-w-0">
													<p className="font-medium text-sm shrink-0">
														Status:
													</p>
													<div
														className={`border border-[#E2E8F0] rounded-md px-2 py-1 text-sm shrink-0 ${
															selectedTest.httpStatus === 200 ||
															selectedTest.httpStatus === 204
																? "text-[#17C964]"
																: "text-[#EF4444]"
														}`}
													>
														{selectedTest.httpStatus} {selectedTest.statusText}
													</div>
												</div>
												<div className="flex items-center space-x-2 min-w-0">
													<p className="font-medium text-sm shrink-0">
														Method:
													</p>
													<div
														className={`border border-[#E2E8F0] rounded-md px-2 py-1 text-sm shrink-0 ${
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
												<div className="flex flex-col space-y-1 min-w-0">
													<p className="font-medium text-sm shrink-0">
														Test Name:
													</p>
													<p
														className="text-[#475569] text-sm truncate"
														title={selectedTest.testName}
													>
														{selectedTest.testName}
													</p>
												</div>
												<div className="flex flex-col space-y-1 min-w-0">
													<p className="font-medium text-sm shrink-0">
														Endpoint:
													</p>
													<p
														className="text-[#475569] font-mono text-sm truncate"
														title={selectedTest.endpoint}
													>
														{selectedTest.endpoint}
													</p>
												</div>
											</div>
										</div>

										<hr className="border-[#E2E8F0]" />

										<RequestMetadataWithLogs selectedTest={selectedTest} />
									</div>
								) : (
									<div className="flex items-center justify-center h-64 text-[#94A3B8]">
										<p className="text-sm">
											Select a completed test to view details
										</p>
									</div>
								)}
							</div>
						</div>
					</ResizablePanel>

					<ResizableHandle withHandle />

					{/* Right Panel: Test Results */}
					<ResizablePanel defaultSize={60} minSize={30} maxSize={75}>
						<div className="p-6 h-full flex flex-col overflow-hidden">
							<MonitoringData
								testResults={testResults}
								onSelectTest={handleTestSelect}
								selectedTestId={selectedTestId}
							/>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>

			{/* Logs Modal */}
			<Dialog open={logsModalOpen} onOpenChange={setLogsModalOpen}>
				<DialogContent className="max-w-4xl h-[80vh] flex flex-col">
					<DialogHeader>
						<DialogTitle>Live Logs</DialogTitle>
					</DialogHeader>
					<div className="flex-1 overflow-hidden">
						<LiveLogConsole logs={allLogs} compact={false} />
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
