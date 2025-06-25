import type {
	ExecutionBatch,
	ExecutionResult,
	ExecutionRequest,
	RequestExecution,
	TestResult,
	TestStatus,
} from "@/types/monitoring-type";

export function transformBackendData(batches: ExecutionBatch[]): TestResult[] {
	const allResults: TestResult[] = [];

	batches.forEach((batch) => {
		batch.results.forEach((result) => {
			const transformedResult: TestResult = {
				id: result.resultId,
				testName: generateTestName(result),
				status: mapStatus(result.status),
				date: new Date(result.startTimestamp).toISOString().split("T")[0],
				method: result.requestDefinitionSnapshot.method,
				endpoint:
					result.requestSentDetails?.url ||
					result.requestDefinitionSnapshot.url,
				httpStatus: result.responseStatusCode,
				statusText: getStatusText(result.responseStatusCode),
				metadata: {
					headers:
						result.requestSentDetails?.headers ||
						result.requestDefinitionSnapshot.headers,
					body: result.requestDefinitionSnapshot.body,
					timestamp: result.startTimestamp,
					responseHeaders: result.responseHeaders,
					responseBody: result.responseBody,
					responseSizeBytes: result.responseSizeBytes,
					assertionResults: result.assertionResults,
				},
				logs: generateLogs(result),
				durationMs: result.durationMs,
				batchId: result.batchId,
				executionOrder: result.executionOrder,
				// ✨ FIX: Added the two missing properties below
				testCaseId: result.testCaseId || "", // Added fallback for potential null
				isExpectedSuccess: result.isExpectedSuccess,
			};

			allResults.push(transformedResult);
		});
	});

	// Sort by batch creation time and execution order
	return allResults.sort((a, b) => {
		const batchA = batches.find((batch) => batch.batchId === a.batchId);
		const batchB = batches.find((batch) => batch.batchId === b.batchId);

		if (batchA && batchB) {
			const timeCompare =
				new Date(batchB.createdAt).getTime() -
				new Date(batchA.createdAt).getTime();
			if (timeCompare !== 0) return timeCompare;
		}

		return a.executionOrder - b.executionOrder;
	});
}

function generateTestName(result: ExecutionResult): string {
	const method = result.requestDefinitionSnapshot.method;
	const url = result.requestDefinitionSnapshot.url;

	// Generate a meaningful test name based on the request
	if (result.testCaseId) {
		return `${method} ${url} - Test Case ${result.executionOrder + 1}`;
	}

	return `${method} Request Test`;
}

// Add a helper to build names for the raw `requestExecution` items (those have `method` / `url` directly):
function generateTestNameFromRequest(
	req: RequestExecution,
	index: number
): string {
	// Ex: "GET awdda/{wdwd} – Test 1"
	return `${req.method} ${req.url} - Test ${index + 1}`;
}

// Update the mapStatus function to handle EXECUTING status better
function mapStatus(backendStatus: string): TestStatus {
	switch (backendStatus) {
		case "EXECUTING":
			return "loading";
		case "PASSED":
			return "passed";
		case "FAILED":
			return "failed";
		default:
			return "pending";
	}
}

function getStatusText(statusCode: number | null): string {
	if (!statusCode) return "Unknown";

	const statusTexts: Record<number, string> = {
		200: "OK",
		201: "Created",
		204: "No Content",
		400: "Bad Request",
		401: "Unauthorized",
		403: "Forbidden",
		404: "Not Found",
		410: "Gone",
		500: "Internal Server Error",
	};

	return statusTexts[statusCode] || "Unknown";
}

function generateLogs(result: ExecutionResult): Array<{
	level: "INFO" | "WARNING" | "ERROR" | "DEBUG";
	message: string;
	source?: string;
}> {
	const logs: Array<{
		level: "INFO" | "WARNING" | "ERROR" | "DEBUG";
		message: string;
		source?: string;
	}> = [];

	// Starting log
	logs.push({
		level: "INFO",
		message: `Starting ${result.requestDefinitionSnapshot.method} request test`,
		source: "TestRunner",
	});

	// Connection log
	logs.push({
		level: "INFO",
		message: "Connecting to API endpoint",
		source: "HttpClient",
	});

	// Request sending log
	logs.push({
		level: "INFO",
		message: `Sending ${result.requestDefinitionSnapshot.method} request to ${result.requestDefinitionSnapshot.url}`,
		source: "HttpClient",
	});

	// Request details
	if (
		result.requestDefinitionSnapshot.body &&
		Object.keys(result.requestDefinitionSnapshot.body).length > 0
	) {
		logs.push({
			level: "DEBUG",
			message: `Request body serialized: ${
				JSON.stringify(result.requestDefinitionSnapshot.body).length
			} bytes`,
			source: "HttpClient",
		});
	}

	// Response received
	if (result.responseStatusCode) {
		logs.push({
			level: "INFO",
			message: `Response received: ${result.responseStatusCode} ${getStatusText(
				result.responseStatusCode
			)}`,
			source: "HttpClient",
		});
	}

	// Duration info
	if (result.durationMs) {
		logs.push({
			level: "DEBUG",
			message: `Response time: ${result.durationMs}ms`,
			source: "TestRunner",
		});
	}

	// Assertion results
	if (result.assertionResults) {
		Object.entries(result.assertionResults).forEach(([key, value]) => {
			const level = value.includes("PASSED") ? "INFO" : "ERROR";
			logs.push({
				level,
				message: value,
				source: "TestRunner",
			});
		});
	}

	// Final status
	if (result.status === "PASSED") {
		logs.push({
			level: "INFO",
			message: "Test passed successfully",
			source: "TestRunner",
		});
	} else if (result.status === "FAILED") {
		logs.push({
			level: "ERROR",
			message: "Test failed",
			source: "TestRunner",
		});
	}

	// Connection closed
	logs.push({
		level: "INFO",
		message: "Connection closed",
		source: "HttpClient",
	});

	return logs;
}

// Add a function to simulate completing executing tests after some time
export function simulateExecutingTests(
	testResults: TestResult[]
): TestResult[] {
	return testResults.map((test) => {
		// If test is in loading state for more than 30 seconds, mark it as failed
		if (test.status === "loading") {
			const startTime = new Date(test.metadata.timestamp).getTime();
			const now = new Date().getTime();
			const timeDiff = now - startTime;

			// If more than 30 seconds, mark as failed
			if (timeDiff > 30000) {
				return {
					...test,
					status: "failed" as TestStatus,
					logs: [
						...test.logs,
						{
							level: "ERROR" as const,
							message: "Test execution timeout - marked as failed",
							source: "TestRunner",
						},
					],
				};
			}
		}
		return test;
	});
}

// Transform the request payload into initial test results
export function transformRequestToTests(
	executionRequest: ExecutionRequest
): TestResult[] {
	return executionRequest.requestExecution.map((request, index) => ({
		id: `${request.testCaseId}-${index}`,
		testName: generateTestNameFromRequest(request, index),
		status: "pending" as TestStatus,
		date: new Date().toISOString().split("T")[0],
		method: request.method,
		endpoint: request.url,
		httpStatus: null,
		statusText: "Pending",
		metadata: {
			headers: request.headers,
			body: request.body,
			timestamp: new Date().toISOString(),
			requestId: request.requestId,
			testCaseId: request.testCaseId,
			isExpectedSuccess: request.isExpectedSuccess,
		},
		logs: generateInitialLogs(request),
		durationMs: null,
		batchId: "", // Will be set when execution starts
		executionOrder: index,
		testCaseId: request.testCaseId,
		isExpectedSuccess: request.isExpectedSuccess,
	}));
}

// Simulate the final results after execution
export function simulateExecutionResults(tests: TestResult[]): TestResult[] {
	return tests.map((test, index) => {
		const outcomes = [
			{ status: "passed" as TestStatus, statusCode: 200, statusText: "OK" },
			{
				status: "failed" as TestStatus,
				statusCode: 404,
				statusText: "Not Found",
			},
			{
				status: "passed" as TestStatus,
				statusCode: 201,
				statusText: "Created",
			},
			{
				status: "failed" as TestStatus,
				statusCode: 500,
				statusText: "Internal Server Error",
			},
		];

		const outcome = outcomes[index % outcomes.length];
		const duration = Math.floor(Math.random() * 2000) + 500;

		return {
			...test,
			status: outcome.status,
			httpStatus: outcome.statusCode,
			statusText: outcome.statusText,
			durationMs: duration,
			metadata: {
				...test.metadata,
				responseHeaders: {
					"Content-Type": "application/json",
					Date: new Date().toISOString(),
					Server: "test-server",
				},
				responseBody:
					outcome.status === "passed"
						? '{"success": true, "message": "Request completed successfully"}'
						: '{"error": true, "message": "Request failed"}',
				responseSizeBytes: outcome.status === "passed" ? 65 : 45,
				assertionResults: {
					statusCodeAssertion:
						outcome.status === "passed"
							? `PASSED: Expected success, got ${outcome.statusCode}`
							: `FAILED: Expected success, got ${outcome.statusCode}`,
				},
			},
			logs: generateCompletedLogs(
				test,
				outcome.status,
				outcome.statusCode,
				outcome.statusText,
				duration
			),
		};
	});
}

function generateInitialLogs(request: RequestExecution): Array<{
	level: "INFO" | "WARNING" | "ERROR" | "DEBUG";
	message: string;
	source?: string;
}> {
	return [
		{
			level: "INFO",
			message: `Test case initialized: ${request.testCaseId}`,
			source: "TestRunner",
		},
		{
			level: "DEBUG",
			message: `Expected success: ${request.isExpectedSuccess}`,
			source: "TestRunner",
		},
	];
}

function generateCompletedLogs(
	test: TestResult,
	finalStatus: TestStatus,
	statusCode: number,
	statusText: string,
	duration: number
): Array<{
	level: "INFO" | "WARNING" | "ERROR" | "DEBUG";
	message: string;
	source?: string;
}> {
	const logs = [
		...test.logs,
		{
			level: "INFO" as const,
			message: `Starting ${test.method} request test`,
			source: "TestRunner",
		},
		{
			level: "INFO" as const,
			message: "Connecting to API endpoint",
			source: "HttpClient",
		},
		{
			level: "INFO" as const,
			message: `Sending ${test.method} request to ${test.endpoint}`,
			source: "HttpClient",
		},
	];

	// Add body info if present
	if (test.metadata.body && Object.keys(test.metadata.body).length > 0) {
		logs.push({
			level: "DEBUG",
			message: `Request body serialized: ${
				JSON.stringify(test.metadata.body).length
			} bytes`,
			source: "HttpClient",
		});
	}

	// Add response logs
	logs.push({
		level: "INFO",
		message: `Response received: ${statusCode} ${statusText}`,
		source: "HttpClient",
	});

	logs.push({
		level: "DEBUG",
		message: `Response time: ${duration}ms`,
		source: "TestRunner",
	});

	// Add assertion results
	if (finalStatus === "passed") {
		logs.push({
			level: "INFO",
			message: "Test passed successfully",
			source: "TestRunner",
		});
	} else {
		logs.push({
			level: "ERROR",
			message: "Test failed - assertion did not pass",
			source: "TestRunner",
		});
	}

	logs.push({
		level: "INFO",
		message: "Connection closed",
		source: "HttpClient",
	});

	return logs;
}
