"use server";

import {
	createRequestByCollectionId,
	deleteRequestByIdService,
	duplicateRequest,
	getRequestByCollectionId,
	updateRequestByIdService,
	updateRequestPathVariablesService,
	updateRequestUrlAndMethodService,
} from "@/service/request-service";
import { EndpointItem } from "@/types";
import { VariableTestCase } from "@/types/request-type";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const fetchRequestForCollection = async (
	collectionId: string
): Promise<EndpointItem[]> => {
	if (!collectionId) {
		console.warn("No collectionId provided for fetchRequestForCollection");
		return [];
	}
	console.log(collectionId);
	// const endpoints = await getAllRequest(collectionId);
	const endpoints = await getRequestByCollectionId({ collectionId });
	// Log endpoints returned
	console.log(`Endpoints fetched for collection ${collectionId}:`, endpoints);
	return endpoints;
};

//Create endpoint
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

		console.log("RESPONSE", response);

		if (!response || !response.id) {
			console.error(
				"createRequestByCollectionIdAction: Invalid response",
				response
			);
			return null;
		}

		console.log("createRequestByCollectionIdAction response:", response);
		console.log(
			response.id,
			response.name || payload.requestName,
			response.method || payload.method,
			response.name || payload.requestName
		);
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

//Delete endpoint
export const deleteRequestAction = async (
	collectionId: string,
	endpointId: string,
	projectId: string
) => {
	try {
		await deleteRequestByIdService(endpointId);
		await getRequestByCollectionId({ collectionId });
	} catch (error) {
		console.error("Error deleting endpoint:", error);
		throw error;
	}
};

//Update endpoint
export const updateRequestByIdAction = async (
	collectionId: string,
	endpointId: string,
	payload: { name: string }
): Promise<void> => {
	try {
		console.log("updateRequestByIdAction:", {
			collectionId,
			endpointId,
			payload,
		});
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

export const updateRequestPathVariablesAction = async (
	requestId: string,
	// The payload is the final object, not the complex array from the UI state
	pathVariablesPayload: Record<string, any>
) => {
	console.log(
		`Saving path variables for request ${requestId}:`,
		pathVariablesPayload
	);

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
	console.log("Creating test case with payload:", payload);

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
	console.log(`Deleting test case with ID: ${testInstanceId}`);

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

		console.log("duplicateRequestAction response:", response);
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
