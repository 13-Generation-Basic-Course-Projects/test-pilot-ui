import { fetchAPI } from "@/lib/api";
import { REQUEST_ENDPOINT } from "@/lib/static";
import { RequestResponseTypes } from "@/types/request-type";

export const getRequestByCollectionId = async ({
	collectionId,
}: {
	collectionId: string;
}) => {
	const response = await fetchAPI<RequestResponseTypes>(
		`${REQUEST_ENDPOINT}/by-collection/${collectionId}`
	);

	return response.payload.map((request) => ({
		id: request.id,
		name: request.name,
		method: request.method || "GET",
		path: request.path || "/new-request",
		details: request.details,
	}));
};

//Add request
export const createRequestByCollectionId = async ({
	collectionId,
	name,
	method,
	details,
}: {
	collectionId: string;
	name: string;
	method: string;
	details: {
		url: string;
		pathVariables: Record<string, string>;
		queryParams: Record<string, string>;
		headers: Record<string, string>;
		body: any;
		description: string;
	};
}) => {
	try {
		const newRequest = {
			name: name.trim(),
			collectionId,
			method,
			details,
		};

		const response = await fetchAPI<RequestResponseTypes>(
			`${REQUEST_ENDPOINT}`,
			{
				method: "POST",
				body: JSON.stringify(newRequest),
			}
		);

		console.log("createRequestByCollectionId response:", response);
		return response.payload;
	} catch (error) {
		console.error("createRequestByCollectionId error:", error);
		throw error;
	}
};

// Delete request by ID
export const deleteRequestByIdService = async (
	requestId: string
): Promise<void> => {
	await fetchAPI(`${REQUEST_ENDPOINT}/${requestId}`, {
		method: "DELETE",
	});
};

//Update request by id
export const updateRequestByIdService = async (
	requestId: string,
	payload: { name: string; path?: string; collectionId: string }
): Promise<void> => {
	try {
		const existingRequest = await fetchAPI<RequestResponseTypes>(
			`${REQUEST_ENDPOINT}/${requestId}`
		);

		console.log("existingRequest", existingRequest);

		if (!existingRequest.payload.method || !existingRequest.payload.details) {
			throw new Error(
				"Existing request is missing required fields: method or details"
			);
		}

		const updatedPayload = {
			name: payload.name,
			path: payload.path || payload.name,
			method: existingRequest.payload.method,
			collectionId: payload.collectionId,
			details: existingRequest.payload.details,
		};

		const response = await fetchAPI(`${REQUEST_ENDPOINT}/${requestId}`, {
			method: "PUT",
			body: JSON.stringify(updatedPayload),
		});
		console.log("Update response:", response);
	} catch (error) {
		console.error("updateRequestByIdService error:", error);
		throw error;
	}
};

export const updateRequestUrlAndMethodService = async (
	requestId: string,
	payload: { method: string; url: string }
): Promise<void> => {
	try {
		// First, get the current state of the request to preserve other fields
		const existingRequest = await fetchAPI<RequestResponseTypes>(
			`${REQUEST_ENDPOINT}/${requestId}`
		);

		// Prepare the updated payload by merging new details
		const updatedPayload = {
			...existingRequest.payload, // Keep existing fields like name, path etc.
			method: payload.method, // Set the new method from the payload
			details: {
				...existingRequest.payload.details, // Keep other existing details
				url: payload.url, // Set the new URL from the payload
			},
		};

		// Send the final, merged payload to your backend
		await fetchAPI(`${REQUEST_ENDPOINT}/${requestId}`, {
			method: "PUT",
			body: JSON.stringify(updatedPayload),
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("updateRequestDetails service error:", error);
		throw error;
	}
};

export const updateRequestPathVariablesService = async (
	requestId: string,
	pathVariablesPayload: Record<string, any> // Accepts the path variables object
): Promise<void> => {
	try {
		// First, get the current state of the request to preserve other fields
		const existingRequest = await fetchAPI<RequestResponseTypes>(
			`${REQUEST_ENDPOINT}/${requestId}`
		);

		// Prepare the updated payload by merging the new path variables
		const updatedDetails = {
			...existingRequest.payload.details, // Keep other existing details (like url, body, etc.)
			pathVariables: pathVariablesPayload, // Set the new path variables
		};

		const updatedPayload = {
			...existingRequest.payload, // Keep top-level fields like name, method, etc.
			details: updatedDetails, // Add the merged details object
		};

		// Send the final, merged payload to your backend
		await fetchAPI(`${REQUEST_ENDPOINT}/${requestId}`, {
			method: "PUT",
			body: JSON.stringify(updatedPayload),
		});
	} catch (error) {
		console.error("updateRequestPathVariablesService error:", error);
		throw error;
	}
};

export const createTestCaseService = async () => {};

//Duplicate request
export const duplicateRequest = async ({
	requestId,
	collectionId,
}: {
	requestId: string;
	collectionId: string;
}): Promise<RequestResponseTypes> => {
	try {
		if (!requestId) {
			throw new Error("Invalid request ID provided");
		}

		const existingRequest = await fetchAPI<RequestResponseTypes>(
			`${REQUEST_ENDPOINT}/${requestId}`
		);

		if (!existingRequest.payload) {
			throw new Error("Request not found");
		}

		const newRequest = {
			name: `${existingRequest.payload.name} (Copy)`,
			collectionId,
			method: existingRequest.payload.method || "GET",
			details: existingRequest.payload.details || {
				url: "",
				pathVariables: {},
				queryParams: {},
				headers: {},
				body: null,
				description: "",
			},
		};

		const response = await fetchAPI<RequestResponseTypes>(
			`${REQUEST_ENDPOINT}`,
			{
				method: "POST",
				body: JSON.stringify(newRequest),
			}
		);

		console.log("duplicateRequest response:", response);
		return response.payload;
	} catch (error) {
		console.error("duplicateRequest error:", error);
		throw error;
	}
};
