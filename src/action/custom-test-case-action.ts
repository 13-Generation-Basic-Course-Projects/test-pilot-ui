"use server";

import {
	createCustomTestCaseService,
	CreateCustomTestCasePayload,
	getCustomTestCaseService,
	deleteCustomTestCaseService,
	updateCustomTestCaseService,
} from "@/service/custom-test-case-service";
import { revalidatePath } from "next/cache";

export const getCustomTestCaseAction = async (projectId: string) => {
	try {
		const data = await getCustomTestCaseService(projectId);

		// Optional: Revalidate the path if you want the list to be fresh on next visit
		// revalidatePath(`/project/${payload.projectId}/settings`);

		return data.payload;
	} catch (error) {
		// Return a structured error so the frontend can display it
		return {
			success: false,
			message:
				error instanceof Error ? error.message : "An unknown error occurred.",
			payload: null,
		};
	}
};

// The action takes the same payload as the service
export const createCustomTestCaseAction = async (
	payload: CreateCustomTestCasePayload
) => {
	try {
		const data = await createCustomTestCaseService(payload);

		// Optional: Revalidate the path if you want the list to be fresh on next visit
		// revalidatePath(`/project/${payload.projectId}/settings`);

		return data;
	} catch (error) {
		// Return a structured error so the frontend can display it
		return {
			success: false,
			message:
				error instanceof Error ? error.message : "An unknown error occurred.",
			payload: null,
		};
	}
};

export const deleteCustomTestCaseAction = async (testcaseId: string) => {
	try {
		await deleteCustomTestCaseService(testcaseId);
		revalidatePath(`/project/${testcaseId.split('-')[0]}/settings`);
		return { success: true, message: "Test case deleted successfully.", payload: null };
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : "An error occurred.",
			payload: null,
		};
	}
};

//update custom test case
export const updateCustomTestCaseAction = async (
	testcaseId: string,
	payload: { name: string; value: string; dataTypeId: string }
) => {
	try {
		const data = await updateCustomTestCaseService(testcaseId, payload);
		return data;
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : "An unknown error occurred.",
			payload: null,
		};
	}
};
