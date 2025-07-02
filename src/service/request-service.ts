import { fetchAPI } from "@/lib/api";
import { REQUEST_ENDPOINT, REQUEST_TEST_CASE_ENDPOINT } from "@/lib/static";
import { EndpointItem } from "@/types";
import { PayloadTestCaseType } from "@/types/request-test-case";
import {
	RequestResponseTypes,
	TestCaseRequestResponseType,
	TestCaseRequestType,
} from "@/types/request-type";

export const getRequestByCollectionId = async ({
	collectionId,
}: {
	collectionId: string;
}): Promise<EndpointItem[]> => {
	try {
		const response = await fetchAPI<RequestResponseTypes>(
			`${REQUEST_ENDPOINT}/by-collection/${collectionId}`
		);

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
			details: request.details,
		}));
	} catch (error) {
		console.error(
			`getRequestByCollectionId Error for collectionId ${collectionId}:`,
			error
		);
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

export const updateRequestQueryParamsService = async (
	requestId: string,
	queryParamsPayload: Record<string, any>
): Promise<void> => {
	try {
		const existingRequest = await fetchAPI<RequestResponseTypes>(
			`${REQUEST_ENDPOINT}/${requestId}`
		);

		const updatedDetails = {
			...existingRequest.payload.details,
			queryParams: queryParamsPayload, // Set the new query params
		};

		const updatedPayload = {
			...existingRequest.payload,
			details: updatedDetails,
		};

		await fetchAPI(`${REQUEST_ENDPOINT}/${requestId}`, {
			method: "PUT",
			body: JSON.stringify(updatedPayload),
		});
	} catch (error) {
		console.error("updateRequestQueryParamsService error:", error);
		throw error;
	}
};

export const createTestCaseService = async ({
	requestId,
	testCaseId,
	applicationContext,
	targetFieldPath,
	isExpectedSuccess = false,
}: TestCaseRequestType) => {
	// https://testpilot.yamu.me/api/v1/request-test-cases
	const testCaseData = {
		requestId,
		testCaseId,
		applicationContext,
		targetFieldPath,
		isExpectedSuccess,
	};

	const data = await fetchAPI<TestCaseRequestResponseType>(
		`${REQUEST_TEST_CASE_ENDPOINT}`,
		{
			method: "POST",
			body: JSON.stringify(testCaseData),
		}
	);

	return data;
};

export const getRequestTestCaseService = async ({
	requestId,
}: {
	requestId: string;
}) => {
	// https://testpilot.yamu.me/api/v1/request-test-cases/by-request/938345ed-b738-4751-8f13-db67b8849513
	const data = await fetchAPI<PayloadTestCaseType>(
		`${REQUEST_TEST_CASE_ENDPOINT}/by-request/${requestId}`
	);

	return data.payload;
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

    const collectionRequests = await getRequestByCollectionId({ collectionId });

    // Extract the base name and check if it's a copy
    const baseName = existingRequest.payload.name.replace(/\sCopy(?:\s\d+)?$/, '');
    const isCopy = existingRequest.payload.name.includes("Copy");
    let newName = baseName;

    const namePattern = new RegExp(`^${baseName}\\sCopy(?:\\s(\\d+))?$`);
    let maxNumber = 1;

    // Find the highest number among existing copies
    collectionRequests.forEach((request) => {
      const match = request.name.match(namePattern);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) {
          maxNumber = num;
        }
      }
    });

    // Generate new name
    if (!isCopy && !collectionRequests.some((req) => req.name === `${baseName} Copy`)) {
      newName = `${baseName} Copy`;
    } else {
      newName = `${baseName} Copy ${maxNumber + 1}`;
    }

    const newRequest = {
      name: newName,
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

    return response.payload;
  } catch (error) {
    console.error("duplicateRequest error:", error);
    throw error;
  }
};

export const CreateRequestBodyService = async (
	requestId: string,
	bodyPayload: Record<string, any> // Accepts the path variables object
): Promise<void> => {
	try {
		// First, get the current state of the request to preserve other fields
		const existingRequest = await fetchAPI<RequestResponseTypes>(
			`${REQUEST_ENDPOINT}/${requestId}`
		);

		// Prepare the updated payload by merging the new path variables
		const updatedDetails = {
			...existingRequest.payload.details, // Keep other existing details (like url, body, etc.)
			body: bodyPayload, // Set the new path variables
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

export const deleteRequestTestCaseService = async (
	requestTestCaseId: string
) => {
	try {
		// This sends a DELETE request to /api/v1/request-test-cases/{id}
		await fetchAPI(`${REQUEST_TEST_CASE_ENDPOINT}/${requestTestCaseId}`, {
			method: "DELETE",
		});
	} catch (error) {
		console.error("Error in deleteRequestTestCaseService:", error);
		throw error; // Re-throw to be caught by the action
	}
};
