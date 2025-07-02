import { SingleRequestPayload } from "@/action/send-request-action";
import { fetchAPI } from "@/lib/api";
import { TEST_EXECUTION_ENDPOINT } from "@/lib/static";

/**
 * Service that sends a single request to the backend to be executed.
 * The backend should process this and return a complete batch object.
 */
export const sendRequestService = async (
	payload: SingleRequestPayload
): Promise<any> => {
	try {
		// This should be the same endpoint your "Run All" button uses
		const response = await fetchAPI(TEST_EXECUTION_ENDPOINT, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});
		// The service should return the full batch object from the response payload
		return response.payload;
	} catch (error) {
		console.error("sendRequestService error:", error);
		throw error;
	}
};
