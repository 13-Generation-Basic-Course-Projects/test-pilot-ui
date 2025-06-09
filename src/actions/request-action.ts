import {
	createRequestByCollectionId,
	deleteRequestByIdService,
	getRequestByCollectionId,
	updateRequestByIdService,
} from "@/service/request-service";
import { EndpointItem } from "@/types";

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
	const response = await createRequestByCollectionId({
		collectionId: payload.collectionId,
		name: payload.requestName.trim(),
		method: payload.method,
		details: payload.details,
	});

	if (!response) return null;

	return {
		id: response.requestId,
		name: response.name || payload.requestName,
	};
};

//Delete endpoint
export const deleteRequestAction = async (
	collectionId: string,
	endpointId: string
): Promise<void> => {
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
