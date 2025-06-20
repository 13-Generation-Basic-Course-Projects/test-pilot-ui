"use server";

import { revalidatePath } from "next/cache";
import { saveAllHeadersService } from "@/service/request-header-service"; // Adjust import path

export interface HeaderRow {
	variable: string;
	value: string;
}

/**
 * Saves a complete, merged headers object for a request.
 * This is the only save action we need for headers.
 */
export const saveAllHeadersAction = async (
	requestId: string,
	headersObject: Record<string, string>
) => {
	await saveAllHeadersService(requestId, headersObject);

	// This line is CRITICAL for the UI to update after a save.
	revalidatePath(`/your-app/requests/${requestId}`); // ❗️ Replace with your actual page path
};
