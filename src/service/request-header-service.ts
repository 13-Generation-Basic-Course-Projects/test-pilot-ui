import { fetchAPI } from "@/lib/api";
import { REQUEST_ENDPOINT } from "@/lib/static";

/**
 * Saves the entire, final headers object, completely replacing the old one.
 * This single service handles all header-saving logic.
 */
export const saveAllHeadersService = async (
	requestId: string,
	finalHeaders: Record<string, string>
): Promise<void> => {
	try {
		const existingRequest = await fetchAPI<any>(
			`${REQUEST_ENDPOINT}/${requestId}`
		);

		// Create the final payload with the new, stringified headers object.
		const updatedPayload = {
			...existingRequest.payload,
			details: {
				...existingRequest.payload.details,
				// Stringify the final, merged object into the 'header' field
				header: JSON.stringify(finalHeaders),
			},
		};

		// Send the complete object to the backend.
		await fetchAPI(`${REQUEST_ENDPOINT}/${requestId}`, {
			method: "PUT",
			body: JSON.stringify(updatedPayload),
		});
	} catch (error) {
		console.error("saveAllHeadersService error:", error);
		throw error;
	}
};
