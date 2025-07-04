import { fetchAPI } from "@/lib/api";
import { TEST_EXECUTION_ENDPOINT } from "@/lib/static";
import { TestRunPayload } from "@/action/run-test-action";

/**
 * Simple date validator: checks if a date string is valid ISO date
 */
function isValidDate(dateString: string): boolean {
	const date = new Date(dateString);
	return !isNaN(date.getTime());
}

/**
 * Returns today's date string in YYYY-MM-DD format.
 */
function getTodayDate(): string {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

/**
 * Service that sends the test run payload to the backend API.
 * Ensures runDate is valid, or sets it to today's date.
 */
export const runTestCasesService = async (
	payload: TestRunPayload
): Promise<any> => {
	// Auto-assign today's date if not present or invalid
	if (!payload.runDate || !isValidDate(payload.runDate)) {
		payload.runDate = getTodayDate(); // Set to today's date in YYYY-MM-DD
	}

	try {
		const response = await fetchAPI(TEST_EXECUTION_ENDPOINT, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});
		console.log("RESPONSE", response);
		return response.payload;
	} catch (error) {
		console.error("runTestCasesService error:", error);
		throw error;
	}
};
