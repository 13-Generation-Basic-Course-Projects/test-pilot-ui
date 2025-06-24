"use server";

import { runTestCasesService } from "@/service/run-test-service";

// Define a type for the payload for clarity and safety
export interface TestRunPayload {
	projectId: string;
	triggerType: "SELECTED_TEST_CASES";
	requestExecution: {
		url: string;
		method: string;
		headers: Record<string, any>;
		body: Record<string, any>;
		requestId: string;
		testCaseId: string;
		isExpectedSuccess: boolean;
	}[];
}

/**
 * Action to trigger a new test run with a set of test cases.
 */
export const runTestCasesAction = async (payload: TestRunPayload) => {
	try {
		const result = await runTestCasesService(payload);
		return { success: true, data: result };
	} catch (error) {
		console.error("runTestCasesAction failed:", error);
		// In a real app, you might want to return a more specific error
		return { success: false, error: "Failed to start test run." };
	}
};
