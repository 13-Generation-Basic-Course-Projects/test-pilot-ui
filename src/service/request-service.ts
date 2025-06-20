import { fetchAPI } from "@/lib/api";
import { REQUEST_ENDPOINT } from "@/lib/static";
import { EndpointItem } from "@/types";
import { RequestResponseTypes } from "@/types/request-type";

export const getRequestByCollectionId = async ({
  collectionId,
}: {
  collectionId: string;
}): Promise<EndpointItem[]> => {
  try {
    const response = await fetchAPI<RequestResponseTypes>(
      `${REQUEST_ENDPOINT}/by-collection/${collectionId}`
    );

    console.log("getRequestByCollectionId response:", response);

    if (!response.success || !response.payload) {
      console.warn(
        `getRequestByCollectionId: No valid payload for collectionId ${collectionId}, response:`,
        response
      );
      return [];
    }

    return response.payload.map((request) => ({
      id: request.id,
      name: request.name,
      method: request.method || "GET",
      path: request.path || "/new-request",
    }));
  } catch (error) {
    console.error(`getRequestByCollectionId Error for collectionId ${collectionId}:`, error);
    return [];
  }
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
