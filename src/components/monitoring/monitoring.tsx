"use client";

import { useState, useEffect } from "react";
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
import { ProgressMonitoring } from "./progress";
import { LiveLogConsole } from "./live-log-console";
import { RequestMetadataWithLogs } from "./request-metadata-with-logs";
import { MonitoringData } from "./monitoring-data";

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
	const [testProgress, setTestProgress] = useState({
		completed: 0,
		total: 8,
		currentTest: 0,
	});

	const [allLogs, setAllLogs] = useState<LogEntry[]>([]);
	const [logsModalOpen, setLogsModalOpen] = useState(false);

	const [testResults, setTestResults] = useState<TestResult[]>([
		{
			id: 1,
			testName: "Email - Invalid Format",
			status: "pending",
			date: "2025-06-13",
			method: "POST",
			endpoint: "https://api.kshrd.app/api/v1/auth/register",
			httpStatus: 400,
			statusText: "Bad Request",
			metadata: {
				request: {
					headers: { "Content-Type": "application/json" },
					body: { email: "invalid-email", password: "ValidPassword123" },
				},
				response: {
					headers: { "X-Request-ID": "req-001" },
					body: { error: "Invalid email format" },
				},
			},
			logs: [
				{ level: "INFO", message: "Test Passed: API correctly returned 400." },
			],
		},
		{
			id: 2,
			testName: "Email - SQL Injection",
			status: "pending",
			date: "2025-06-13",
			method: "POST",
			endpoint: "https://api.kshrd.app/api/v1/auth/register",
			httpStatus: 400,
			statusText: "Bad Request",
			metadata: {
				request: {
					headers: { "Content-Type": "application/json" },
					body: { email: "' OR 1=1;--", password: "ValidPassword123" },
				},
				response: {
					headers: { "X-Request-ID": "req-002" },
					body: { error: "Malicious input detected" },
				},
			},
			logs: [
				{
					level: "INFO",
					message: "Test Passed: API correctly blocked the request.",
				},
			],
		},
		{
			id: 3,
			testName: "Password - Weak Policy",
			status: "pending",
			date: "2025-06-13",
			method: "POST",
			endpoint: "https://api.kshrd.app/api/v1/auth/register",
			httpStatus: 400,
			statusText: "Bad Request",
			metadata: {
				request: {
					headers: { "Content-Type": "application/json" },
					body: { email: "test@example.com", password: "password" },
				},
				response: {
					headers: { "X-Request-ID": "req-003" },
					body: { error: "Password does not meet complexity requirements" },
				},
			},
			logs: [
				{
					level: "INFO",
					message: "Test Passed: API correctly enforced password policy.",
				},
			],
		},
		{
			id: 4,
			testName: "Password - Empty",
			status: "pending",
			date: "2025-06-13",
			method: "POST",
			endpoint: "https://api.kshrd.app/api/v1/auth/register",
			httpStatus: 400,
			statusText: "Bad Request",
			metadata: {
				request: {
					headers: { "Content-Type": "application/json" },
					body: { email: "test@example.com", password: "" },
				},
				response: {
					headers: { "X-Request-ID": "req-004" },
					body: { error: "Password cannot be empty" },
				},
			},
			logs: [
				{
					level: "INFO",
					message: "Test Passed: API correctly validated for empty password.",
				},
			],
		},
		{
			id: 5,
			testName: "Username - Too Long",
			status: "pending",
			date: "2025-06-13",
			method: "POST",
			endpoint: "https://api.kshrd.app/api/v1/auth/register",
			httpStatus: 400,
			statusText: "Bad Request",
			metadata: {
				request: {
					headers: { "Content-Type": "application/json" },
					body: { username: "a".repeat(100) },
				},
				response: {
					headers: { "X-Request-ID": "req-005" },
					body: { error: "Username exceeds maximum length" },
				},
			},
			logs: [
				{
					level: "INFO",
					message: "Test Passed: API correctly validated username length.",
				},
			],
		},
		// --- THIS IS NOW A FAILED TEST ---
		{
			id: 6,
			testName: "Username - Only Space",
			status: "pending",
			date: "2025-06-13",
			method: "POST",
			endpoint: "https://api.kshrd.app/api/v1/auth/register",
			httpStatus: 200,
			statusText: "OK",
			metadata: {
				request: {
					headers: { "Content-Type": "application/json" },
					body: { username: "   ", password: "ValidPassword123" },
				},
				response: {
					headers: { "X-Request-ID": "req-006", "Set-Cookie": "..." },
					body: { message: "User registered successfully!" },
				},
			},
			logs: [
				{
					level: "ERROR",
					message:
						"Test Failed: API incorrectly allowed a username with only spaces.",
				},
			],
		},
		// --- THIS IS NOW A FAILED TEST ---
		{
			id: 7,
			testName: "Age - Negative Value",
			status: "pending",
			date: "2025-06-13",
			method: "POST",
			endpoint: "https://api.kshrd.app/api/v1/auth/register",
			httpStatus: 200,
			statusText: "OK",
			metadata: {
				request: {
					headers: { "Content-Type": "application/json" },
					body: { username: "testuser", age: -10 },
				},
				response: {
					headers: { "X-Request-ID": "req-007", "Set-Cookie": "..." },
					body: { message: "User registered successfully!" },
				},
			},
			logs: [
				{
					level: "ERROR",
					message:
						"Test Failed: API incorrectly returned 200 OK for invalid data.",
				},
			],
		},
		// Age Test 2 (Passed)
		{
			id: 8,
			testName: "Age - Type Mismatch (String)",
			status: "pending",
			date: "2025-06-13",
			method: "POST",
			endpoint: "https://api.kshrd.app/api/v1/auth/register",
			httpStatus: 400,
			statusText: "Bad Request",
			metadata: {
				request: {
					headers: { "Content-Type": "application/json" },
					body: { username: "testuser", age: "twenty" },
				},
				response: {
					headers: { "X-Request-ID": "req-008" },
					body: { error: "Age must be a number" },
				},
			},
			logs: [
				{
					level: "INFO",
					message: "Test Passed: API correctly validated age data type.",
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
			{ id: 2, status: "passed" as const },
			{ id: 3, status: "passed" as const },
			{ id: 4, status: "passed" as const },
			{ id: 5, status: "passed" as const },
			{ id: 6, status: "failed" as const }, // Still fails
			{ id: 7, status: "failed" as const }, // Now fails
			{ id: 8, status: "passed" as const },
		];
		let currentIndex = 0;

		// Add initial system log
		setTimeout(() => {
			addLogEntry({
				level: "INFO",
				message:
					"Test Pilot API initialized - Starting security validation tests",
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
								setTimeout(resolve, Math.random() * 400 + 200)
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
								setTimeout(executeNextTest, Math.random() * 1200 + 800);
							} else {
								// All tests completed
								setTimeout(() => {
									addLogEntry({
										level: "INFO",
										message:
											"All security validation tests completed - Test execution finished",
										source: "System",
									});
								}, 500);
							}
						}, 600);
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
		<div className="w-full max-w-full min-w-0 overflow-hidden mt-10 bg-white rounded-xl shadow p-4 md:p-6 lg:p-8 space-y-6 lg:space-y-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between gap-4">
				<div className="min-w-0">
					<p className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">
						Test Pilot API
					</p>
					<p className="text-[#71717A] text-sm lg:text-base">
						13 Jan 2025, 10:15AM
					</p>
				</div>
				<div className="text-[#71717A] text-sm lg:text-base shrink-0">
					{testProgress.completed}/{testProgress.total} request completed
				</div>
			</div>

			{/* Test Summary */}
			<div className="flex justify-center space-x-8 sm:space-x-16 lg:space-x-50">
				<div className="text-center">
					<p className="text-2xl lg:text-4xl font-semibold">
						{testProgress.total}
					</p>
					<p className="text-[#94A3B8] text-sm lg:text-base">Total Test</p>
				</div>
				<div className="text-center">
					<p className="text-2xl lg:text-4xl font-semibold text-[#17C964]">
						{passedTests}
					</p>
					<p className="text-[#94A3B8] text-sm lg:text-base">Passed</p>
				</div>
				<div className="text-center">
					<p className="text-2xl lg:text-4xl font-semibold text-[#EF4444]">
						{failedTests}
					</p>
					<p className="text-[#94A3B8] text-sm lg:text-base">Failed</p>
				</div>
			</div>

			{/* Execution Summary */}
			<div className="space-y-6 lg:space-y-8 min-w-0">
				<div className="space-y-4">
					<p className="text-xl lg:text-2xl font-semibold">Executed Request</p>
					<div className="flex justify-between text-sm lg:text-base">
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
				<div className="w-[1350px] min-w-0 overflow-hidden mx-auto">
					<ResizablePanelGroup
						direction="horizontal"
						className="h-[500px] lg:h-[600px] rounded-lg border w-full min-w-0"
					>
						{/* Left Panel: Live Logs + Test Details */}
						<ResizablePanel defaultSize={40} minSize={30} maxSize={60}>
							<div className="p-3 lg:p-6 h-full flex flex-col overflow-hidden space-y-4 lg:space-y-6 min-w-0">
								{/* Live Logs Section */}
								<div className="flex-shrink-0 min-w-0">
									<div className="flex justify-between items-center mb-4">
										<h3 className="text-lg lg:text-xl font-semibold truncate">
											Live Logs
										</h3>
										<Button
											variant="outline"
											size="sm"
											className="flex items-center gap-1 shrink-0"
											onClick={() => setLogsModalOpen(true)}
										>
											<Maximize2 className="h-4 w-4" />
											<span className="hidden sm:inline">Expand</span>
										</Button>
									</div>
									<div className="h-32 lg:h-48">
										<LiveLogConsole logs={allLogs} compact={true} />
									</div>
								</div>

								{/* Separator */}
								<hr className="border-[#E2E8F0]" />

								{/* Test Details Section */}
								<div className="flex-1 overflow-hidden min-w-0">
									<h3 className="text-lg lg:text-xl font-semibold mb-4 flex-shrink-0">
										Test Details
									</h3>
									{selectedTest ? (
										<div className="space-y-4 h-full overflow-y-auto min-h-0 min-w-0">
											<div className="space-y-3">
												<div className="flex flex-col space-y-3">
													<div className="flex items-center space-x-2 min-w-0">
														<p className="font-medium text-sm shrink-0">
															Status:
														</p>
														<div
															className={`border border-[#E2E8F0] rounded-md px-2 py-1 text-sm shrink-0 ${
																selectedTest.httpStatus === 400
																	? "text-[#17C964]"
																	: selectedTest.httpStatus === 200
																	? "text-[#F59E0B]"
																	: "text-[#EF4444]"
															}`}
														>
															{selectedTest.httpStatus}{" "}
															{selectedTest.statusText}
														</div>
													</div>
													<div className="flex items-center space-x-2 min-w-0">
														<p className="font-medium text-sm shrink-0">
															Method:
														</p>
														<div className="border border-[#E2E8F0] rounded-md px-2 py-1 text-sm shrink-0 text-[#10B981]">
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
						<ResizablePanel defaultSize={60} minSize={40} maxSize={70}>
							<div className="p-3 lg:p-6 h-full flex flex-col overflow-hidden min-w-0">
								<MonitoringData
									testResults={testResults}
									onSelectTest={handleTestSelect}
									selectedTestId={selectedTestId}
								/>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
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
