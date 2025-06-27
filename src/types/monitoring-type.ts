// Request payload types (what you send to trigger execution)
export interface ExecutionRequest {
	projectId: string;
	triggerType: string;
	requestExecution: RequestExecution[];
}

export interface RequestExecution {
	url: string;
	method: string;
	headers: Record<string, any>;
	body: Record<string, any>;
	requestId: string;
	testCaseId: string;
	isExpectedSuccess: boolean;
}

// Backend response types (what you get back after execution)
export interface BackendResponse {
	message: string;
	status: string;
	success: boolean;
	timestamps: null;
	payload: ExecutionBatch[];
}

export interface ExecutionBatch {
	batchId: string;
	projectId: string;
	userId: string;
	triggerType: string;
	triggerSourceId: string | null;
	startTimestamp: string;
	endTimestamp: string | null;
	overallStatus: "COMPLETED" | "FAILED" | "EXECUTING";
	results: ExecutionResult[];
	createdAt: string;
	updatedAt: string;
}

export interface ExecutionResult {
	resultId: string;
	batchId: string;
	requestId: string;
	testCaseId: string | null;
	isExpectedSuccess: boolean;
	requestDefinitionSnapshot: RequestDefinition;
	executionOrder: number;
	startTimestamp: string;
	endTimestamp: string | null;
	status: "EXECUTING" | "PASSED" | "FAILED";
	requestSentDetails: RequestSentDetails | null;
	responseStatusCode: number | null;
	responseHeaders: Record<string, string> | null;
	responseBody: string | null;
	responseSizeBytes: number | null;
	durationMs: number | null;
	assertionResults: Record<string, string> | null;
	createdAt: string;
}

export interface RequestDefinition {
	url: string;
	body: Record<string, any>;
	method: string;
	headers: Record<string, any>;
}

export interface RequestSentDetails {
	url: string;
	body: Record<string, any>;
	method: string;
	headers: Record<string, string[]>;
}

// Component types (transformed from backend data)
export type TestStatus = "pending" | "loading" | "passed" | "failed";

export interface TestResult {
	id: string;
	testName: string;
	status: TestStatus;
	date: string;
	method: string;
	endpoint: string;
	httpStatus: number | null;
	statusText: string;
	metadata: any;
	logs: Array<{
		level: "INFO" | "WARNING" | "ERROR" | "DEBUG";
		message: string;
		source?: string;
	}>;
	durationMs: number | null;
	batchId: string;
	executionOrder: number;
	testCaseId: string;
	isExpectedSuccess: boolean;
}
