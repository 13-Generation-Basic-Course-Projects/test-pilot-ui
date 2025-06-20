"use server";

import {
	CreateRequestBodyService,
	createRequestByCollectionId,
	createTestCaseService,
	deleteRequestByIdService,
	deleteRequestTestCaseService,
	duplicateRequest,
	getRequestByCollectionId,
	getRequestTestCaseService,
	updateRequestByIdService,
	updateRequestPathVariablesService,
	updateRequestQueryParamsService,
	updateRequestUrlAndMethodService,
} from "@/service/request-service";
import { EndpointItem } from "@/types";
import { TestCaseRequestType, VariableTestCase } from "@/types/request-type";
import { revalidatePath } from "next/cache";

export const fetchRequestForCollection = async (
	collectionId: string
): Promise<EndpointItem[]> => {
	if (!collectionId) {
		console.warn("No collectionId provided for fetchRequestForCollection");
		return [];
	}
	// const endpoints = await getAllRequest(collectionId);
	const endpoints = await getRequestByCollectionId({ collectionId });
	// Log endpoints returned
	return endpoints;
};

// Create endpoint
export const createRequestByCollectionIdAction = async (payload: {
	collectionId: string;
	requestName: string;
	method: string;
	details: {
		url: string;
		pathVariables: Record<string, string>;
		queryParams: Record<string, string>;
		headers: Record<string, string>;
		body: any;
		description: string;
	};
}): Promise<EndpointItem | null> => {
	try {
		const response = await createRequestByCollectionId({
			collectionId: payload.collectionId,
			name: payload.requestName.trim(),
			method: payload.method,
			details: payload.details,
		});

		if (!response || !response.id) {
			console.error(
				"createRequestByCollectionIdAction: Invalid response",
				response
			);
			return null;
		}

		return {
			id: response.id,
			name: response.name || payload.requestName,
			method: response.method || payload.method,
			path: response.name || payload.requestName,
		};
	} catch (error) {
		console.error("createRequestByCollectionIdAction error:", error);
		throw error;
	}
};

// Delete endpoint
export const deleteRequestAction = async (
	collectionId: string,
	endpointId: string,
	projectId: string
) => {
	try {
		await deleteRequestByIdService(endpointId);
		const endpoints = await getRequestByCollectionId({ collectionId });
		// console.log(`deleteRequestAction: Refetched endpoints for collection ${collectionId}:`, endpoints);
		return endpoints;
	} catch (error) {
		console.error("deleteRequestAction error:", error);
		throw error;
	}
};

// Update endpoint
export const updateRequestByIdAction = async (
	collectionId: string,
	endpointId: string,
	payload: { name: string }
): Promise<void> => {
	try {
		await updateRequestByIdService(endpointId, {
			name: payload.name,
			path: payload.name, // Use name as path
			collectionId, // Pass collectionId
		});
		await getRequestByCollectionId({ collectionId }); // Refetch for consistency
	} catch (error) {
		console.error("Error updating endpoint:", error);
		throw error;
	}
};

export const updateRequestUrlAndMethodAction = async (params: {
	projectId: string;
	collectionId: string;
	requestId: string;
	method: string;
	url: string;
}) => {
	try {
		await updateRequestUrlAndMethodService(params.requestId, {
			method: params.method,
			url: params.url,
		});

		const path = `/projects/${params.projectId}/collections/${params.collectionId}/requests/${params.requestId}`;
		revalidatePath(path);
	} catch (error) {
		console.error("Error in updateRequestUrlAndMethodAction:", error);
		throw error;
	}
};

export const updateRequestQueryParamsAction = async (
	requestId: string,
	queryParamsPayload: Record<string, any>
) => {
	try {
		await updateRequestQueryParamsService(requestId, queryParamsPayload);
		revalidatePath(`/project/.*`, "layout");
	} catch (error) {
		console.error("Failed to update query params:", error);
		throw new Error("Could not save query params.");
	}
};

export const updateRequestPathVariablesAction = async (
	requestId: string,
	// The payload is the final object, not the complex array from the UI state
	pathVariablesPayload: Record<string, any>
) => {
	try {
		await updateRequestPathVariablesService(requestId, pathVariablesPayload);
		revalidatePath(`/project/.*`, "layout"); // Revalidate the whole project layout
	} catch (error) {
		console.error("Failed to update path variables:", error);
		throw new Error("Could not save path variables.");
	}
};

export const createVariableTestAction = async (payload: {
	requestId: string;
	predefinedTestCaseId: string;
	applicationContext: "PATH_VARIABLE";
	targetFieldPath: string;
}): Promise<VariableTestCase> => {
	// Your real backend logic to create the record...
	// const newTest = await db.test.create({ data: payload });

	// For this example, we return a mock object.
	const mockNewTest = {
		id: `test_${Date.now()}`, // This ID must come from your database
		predefinedTestCaseId: payload.predefinedTestCaseId,
		predefinedTestCaseName: "A Test Case Name", // In a real app, you'd look this up
	};

	revalidatePath(`/project/.*`, "layout"); // Revalidate to update UI elsewhere
	return mockNewTest;
};

/**
 * ✨ NEW ACTION: Deletes a single test case instance by its unique ID.
 */
export const deleteVariableTestAction = async (testInstanceId: string) => {
	// Your backend logic to delete the test...
	// await db.test.delete({ where: { id: testInstanceId } });

	revalidatePath(`/project/.*`, "layout");
};
//duplicate endpoint
export const duplicateRequestAction = async (
	collectionId: string,
	requestId: string
): Promise<EndpointItem | null> => {
	try {
		if (!requestId) {
			console.error("duplicateRequestAction: Invalid requestId", requestId);
			throw new Error("Invalid request ID");
		}

		const response = await duplicateRequest({
			requestId,
			collectionId,
		});

		if (!response || !response.id) {
			console.error("duplicateRequestAction: Invalid response", response);
			return null;
		}

		return {
			id: response.id,
			name: response.name || "New Request (Copy)",
			method: response.method || "GET",
			path: response.name || "New Request (Copy)",
		};
	} catch (error) {
		console.error("duplicateRequestAction error:", error);
		throw error;
	}
};

export const getRequestTestCaseAction = async ({
	requestId,
}: {
	requestId: string;
}) => {
	const data = await getRequestTestCaseService({ requestId });

	return data;
};

// ✨ ACTION 1: To CREATE a new request test case
export const createRequestTestCaseAction = async (
	args: TestCaseRequestType
) => {
	try {
		const result = await createTestCaseService({
			...args,
		});

		// revalidatePath("/your-page-path"); // Revalidate if needed
		return { success: true, data: result.payload };
	} catch (error) {
		console.error("Failed to create request test case:", error);
		return { success: false, error: "Failed to create test case." };
	}
};

export const createBodyTestCaseAction = async (args: TestCaseRequestType) => {
	try {
		const result = await createTestCaseService({
			...args,
		});

		return { success: true, data: result.payload };
	} catch (error) {
		console.error("Failed to create request test case:", error);
		return { success: false, error: "Failed to create test case." };
	}
};

export const createRequestBodyAction = async (
	requestId: string,
	// The payload is the final object, not the complex array from the UI state
	bodyPayload: Record<string, any>
) => {
	try {
		await CreateRequestBodyService(requestId, bodyPayload);
		revalidatePath(`/project/.*`, "layout"); // Revalidate the whole project layout
	} catch (error) {
		console.error("Failed to create or update body:", error);
		throw new Error("Could not save body.");
	}
};

export const deleteRequestTestCaseAction = async (
	requestTestCaseId: string
) => {
	try {
		await deleteRequestTestCaseService(requestTestCaseId);
		// You can revalidate paths here if needed
		// revalidatePath("/your-path-to-update");
		return { success: true, message: "Test case removed." };
	} catch (error) {
		console.error("Failed to delete request test case:", error);
		return {
			success: false,
			error: "Failed to remove test case.",
		};
	}
};
