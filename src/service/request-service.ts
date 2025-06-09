import { fetchAPI } from "@/lib/api";
import { REQUEST_ENDPOINT } from "@/lib/static";
import { NewRequestPayload } from "@/types";
import { RequestResponseTypes } from "@/types/request-type";

export const getRequestByCollectionId = async ({collectionId}: {collectionId : string}) => {
  const response = await fetchAPI<RequestResponseTypes>(`${REQUEST_ENDPOINT}/by-collection/${collectionId}`)
  
  console.log(response)
   return response.payload.map((request) => ({
    id: request.id,
    name : request.name,
    method: request.method || "GET",
    path: request.path || "/new-request", 
  }));
}

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
  const newRequest = {
    name: name.trim(), // ✅ Changed from requestName to name
    collectionId,
    method,
    details,
  };

  const response = await fetchAPI<RequestResponseTypes>(`${REQUEST_ENDPOINT}`, {
    method: "POST",
    body: JSON.stringify(newRequest),
  });

  return response;
};



// Delete request by ID
export const deleteRequestByIdService = async (requestId: string): Promise<void> => {
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
    const existingRequest = await fetchAPI<RequestResponseTypes>(`${REQUEST_ENDPOINT}/${requestId}`);

    if (!existingRequest.payload.method || !existingRequest.payload.details) {
      throw new Error("Existing request is missing required fields: method or details");
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

