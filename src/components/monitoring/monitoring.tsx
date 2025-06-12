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
			testName: "Empty String",
			status: "pending", // This test will PASS because a 400 is the EXPECTED outcome.
			date: "2025-06-13",
			method: "POST",
			endpoint: "http://96.9.81.187:8787/api/v1/register",
			httpStatus: 400,
			statusText: "Bad Request",
			metadata: {
				// request: {
				//  headers: { "Content-Type": "application/json", "User-Agent": "TestPilot/1.0" },
				//  body: {
				//      username: "testuser_valid",
				//      email: "",
				//      password: "StrongPassword@123",
				//      age: 25
				//  },
				//  timestamp: "2025-06-13T10:30:00Z",
				//  duration: "142ms",
				// },
				response: {
					status: 400,
					statusText: "Bad Request",
					headers: {
						"Content-Type": "application/json",
						"X-Request-ID": "req_reg_001",
					},
					body: {
						error: "Validation failed",
						code: "VALIDATION_ERROR",
						details: {
							email: "Email cannot be an empty string",
						},
					},
					size: "188 bytes",
				},
				// security: {
				//  testType: "Input Validation",
				//  riskLevel: "Medium",
				//  cweId: "CWE-20",
				//  description: "Ensures the backend properly validates empty string inputs for required fields.",
				// },
			},
			logs: [
				{
					level: "INFO",
					message: "Starting test: Empty String in Email",
					source: "TestRunner",
				},
				{
					level: "INFO",
					message:
						"Sending POST request to http://96.9.81.187:8787/api/v1/register",
					source: "HttpClient",
				},
				{
					level: "INFO",
					message: "Response received: 400 Bad Request",
					source: "HttpClient",
				},
				{
					level: "INFO",
					message: "SUCCESS: Backend correctly rejected the request.",
					source: "ValidationEngine",
				},
				{
					level: "INFO",
					message:
						"Test passed: Empty String in Email - Correct validation response.",
					source: "TestRunner",
				},
			],
		},
		{
			id: 2,
			testName: "Weak Password",
			status: "pending", // This test will PASS because a 400 is the EXPECTED outcome.
			date: "2025-06-13",
			method: "POST",
			endpoint: "http://96.9.81.187:8787/api/v1/register",
			httpStatus: 400,
			statusText: "Bad Request",
			metadata: {
				// request: {
				//  headers: { "Content-Type": "application/json", "User-Agent": "TestPilot/1.0" },
				//  body: {
				//      username: "testuser_weakpass",
				//      email: "weakpass@example.com",
				//      password: "password",
				//      age: 30
				//  },
				//  timestamp: "2025-06-13T10:30:05Z",
				//  duration: "195ms",
				// },
				response: {
					status: 400,
					statusText: "Bad Request",
					headers: {
						"Content-Type": "application/json",
						"X-Request-ID": "req_reg_002",
					},
					body: {
						error: "Validation failed",
						code: "WEAK_PASSWORD",
						details: {
							password:
								"Password does not meet complexity requirements. Must include uppercase, lowercase, numbers, and symbols.",
						},
					},
					size: "256 bytes",
				},
				// security: {
				//  testType: "Security Policy Enforcement",
				//  riskLevel: "High",
				//  cweId: "CWE-521",
				//  description: "Testing for enforcement of strong password policies.",
				// },
			},
			logs: [
				{
					level: "INFO",
					message: "Starting test: Weak Password Validation",
					source: "TestRunner",
				},
				{
					level: "INFO",
					message:
						"Sending POST request to http://96.9.81.187:8787/api/v1/register",
					source: "HttpClient",
				},
				{
					level: "INFO",
					message: "Response received: 400 Bad Request",
					source: "HttpClient",
				},
				{
					level: "INFO",
					message: "SUCCESS: Backend correctly enforced password policy.",
					source: "SecurityEngine",
				},
				{
					level: "INFO",
					message:
						"Test passed: Weak Password Validation - Correct security enforcement.",
					source: "TestRunner",
				},
			],
		},
		{
			id: 3,
			testName: "Null Value",
			status: "pending", // This test will FAIL because a 500 error is a server crash, not a validation error.
			date: "2025-06-13",
			method: "POST",
			endpoint: "http://96.9.81.187:8787/api/v1/register",
			httpStatus: 500,
			statusText: "Internal Server Error",
			metadata: {
				// request: {
				//  headers: { "Content-Type": "application/json", "User-Agent": "TestPilot/1.0" },
				//  body: {
				//      username: null,
				//      email: "nulluser@example.com",
				//      password: "StrongPassword@123",
				//      age: 28
				//  },
				//  timestamp: "2025-06-13T10:30:10Z",
				//  duration: "250ms",
				// },
				response: {
					status: 500,
					statusText: "Internal Server Error",
					headers: {
						"Content-Type": "application/json",
						"X-Request-ID": "req_reg_003",
					},
					body: {
						error: "An unexpected error occurred on the server.",
						code: "INTERNAL_SERVER_ERROR",
						details: "Cannot read properties of null (reading 'trim')",
					},
					size: "190 bytes",
				},
				// security: {
				//  testType: "Exception Handling",
				//  riskLevel: "Critical",
				//  cweId: "CWE-476",
				//  description: "Testing for unhandled null pointer exceptions in the backend.",
				//  vulnerability: "Backend crashed due to a null value for username, revealing internal error details.",
				// },
			},
			logs: [
				{
					level: "INFO",
					message: "Starting test: Null Value for Username",
					source: "TestRunner",
				},
				{
					level: "INFO",
					message:
						"Sending POST request to http://96.9.81.187:8787/api/v1/register",
					source: "HttpClient",
				},
				{
					level: "ERROR",
					message: "Response received: 500 Internal Server Error",
					source: "HttpClient",
				},
				{
					level: "ERROR",
					message:
						"FAILURE: Potential null pointer exception. The server did not handle the input gracefully.",
					source: "SecurityEngine",
				},
				{
					level: "INFO",
					message:
						"Test failed: Null Value for Username - Server returned a critical 500 error.",
					source: "TestRunner",
				},
			],
		},
		{
			id: 4,
			testName: "Negative Number",
			status: "pending", // This test will FAIL because the API incorrectly accepts bad data (returns 201 Created).
			date: "2025-06-13",
			method: "POST",
			endpoint: "http://96.9.81.187:8787/api/v1/register",
			httpStatus: 201, // CHANGED: The API incorrectly says "Created".
			statusText: "Created",
			metadata: {
				// request: {
				//  headers: { "Content-Type": "application/json", "User-Agent": "TestPilot/1.0" },
				//  body: {
				//      username: "age_tester",
				//      email: "negativeage@example.com",
				//      password: "StrongPassword@123",
				//      age: -10
				//  },
				//  timestamp: "2025-06-13T10:30:15Z",
				//  duration: "135ms",
				// },
				response: {
					status: 201, // CHANGED
					statusText: "Created", // CHANGED
					headers: {
						"Content-Type": "application/json",
						"X-Request-ID": "req_reg_004",
					},
					body: {
						id: "user-123",
						username: "age_tester",
						message: "User created successfully.", // This should not have happened.
					},
					size: "128 bytes",
				},
				// security: {
				//  testType: "Business Logic Bypass",
				//  riskLevel: "High",
				//  description: "API failed to validate that age must be a positive number, leading to data corruption.",
				//  vulnerability: "Negative values are accepted for age.",
				// },
			},
			logs: [
				{
					level: "INFO",
					message: "Starting test: Negative Number for Age",
					source: "TestRunner",
				},
				{
					level: "INFO",
					message:
						"Sending POST request to http://96.9.81.187:8787/api/v1/register",
					source: "HttpClient",
				},
				{
					level: "ERROR",
					message: "Response received: 201 Created",
					source: "HttpClient",
				}, // This is an error in the context of this test
				{
					level: "ERROR",
					message:
						"FAILURE: The backend accepted a negative age and created a user.",
					source: "ValidationEngine",
				},
				{
					level: "INFO",
					message:
						"Test failed: Negative Number for Age - Invalid data was accepted.",
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
			{ id: 2, status: "passed" as const },
			{ id: 3, status: "failed" as const },
			{ id: 4, status: "failed" as const },
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
