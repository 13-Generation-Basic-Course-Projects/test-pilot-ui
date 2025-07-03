import { fetchAPI } from "@/lib/api"; // Assuming you have a fetch wrapper
import { TEST_CASE_ENDPOINT } from "@/lib/static"; // Assuming this is '/test-cases' or similar

// This type matches the payload your backend needs.
export type CreateCustomTestCasePayload = {
	projectId: string;
	dataTypeId: string;
	name: string;
	value: string;
};

export const getCustomTestCaseService = async (projectId: string) => {
	try {
		const res = await fetchAPI(`${TEST_CASE_ENDPOINT}/by-project/${projectId}`);

		// It's good practice to check if the response is what you expect
		if (!res.success || !res.payload) {
			throw new Error(res.message || "Failed to get custom test case.");
		}

		return res;
	} catch (error) {
		console.error("Error in getCustomTestCaseService:", error);
		// Re-throw the error so the action can catch it
		throw error;
	}
};

export const createCustomTestCaseService = async (
	payload: CreateCustomTestCasePayload
) => {
	try {
		const res = await fetchAPI(`${TEST_CASE_ENDPOINT}`, {
			method: "POST",
			body: JSON.stringify(payload),
		});

		// It's good practice to check if the response is what you expect
		if (!res.success || !res.payload) {
			throw new Error(res.message || "Failed to create test case.");
		}

		return res;
	} catch (error) {
		console.error("Error in createCustomTestCaseService:", error);
		// Re-throw the error so the action can catch it
		throw error;
	}
};

export const deleteCustomTestCaseService = async (testcaseId: string) => {
	try {
		await fetchAPI(`${TEST_CASE_ENDPOINT}/${testcaseId}`, {
			method: "DELETE",
		});
	} catch (error) {
		console.error("Error deleting test case:", error);
		throw error;
	}
};

//update test custom test case
export const updateCustomTestCaseService = async (
	testcaseId: string,
	payload: { name: string; value: string; dataTypeId: string }
) => {
	try {
		const res = await fetchAPI(`${TEST_CASE_ENDPOINT}/${testcaseId}`, {
			method: "PUT",
			body: JSON.stringify(payload),
		});

		if (!res.success || !res.payload) {
			throw new Error(res.message || "Failed to update test case.");
		}

		return res;
	} catch (error) {
		console.error("Error in updateCustomTestCaseService:", error);
		throw error;
	}
};

