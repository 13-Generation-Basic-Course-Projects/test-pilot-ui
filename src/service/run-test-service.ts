import { fetchAPI } from "@/lib/api";
import { TEST_EXECUTION_ENDPOINT } from "@/lib/static"; // Assuming you have an endpoint for this
import { TestRunPayload } from "@/action/run-test-action";
import { HistoryType } from "@/components/history/history";

/**
 * Service that sends the test run payload to the backend API.
 */
export const runTestCasesService = async (
	payload: TestRunPayload
): Promise<any> => {
	try {
		// This sends the entire payload as the body of a POST request
		const response = await fetchAPI<HistoryType>(TEST_EXECUTION_ENDPOINT, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});
		return response.payload;
	} catch (error) {
		console.error("runTestCasesService error:", error);
		// Re-throw the error to be caught by the action
		throw error;
	}
};
