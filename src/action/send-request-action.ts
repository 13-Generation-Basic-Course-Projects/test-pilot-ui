"use server";

import { sendRequestService } from "@/service/send-request-service";

// This is the payload your backend expects for a single test run
// It's similar to the TestRunPayload but for one request.
export type SingleRequestPayload = {
	projectId: string;
	triggerType: "SINGLE_REQUEST"; // A new trigger type for this action
	requestExecution: {
		url: string;
		method: string;
		headers: Record<string, any>;
		body: Record<string, any>;
		requestId: string;
		isExpectedSuccess: boolean;
	}[];
};

/**
 * Action to trigger a single request run.
 */
export const sendSingleRequestAction = async (
	payload: SingleRequestPayload
) => {
	try {
		const result = await sendRequestService(payload);
		return { success: true, data: result };
	} catch (error) {
		console.error("sendSingleRequestAction failed:", error);
		return { success: false, error: "Failed to run request." };
	}
};
