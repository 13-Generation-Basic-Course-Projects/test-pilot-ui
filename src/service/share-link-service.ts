import { fetchAPI } from "@/lib/api";
import { PUBLIC_SHARE_LINK } from "@/lib/static";

interface ShareResponsePayload {
  token: string; 
}

// Get token endpoint
export const shareEndpoint = async (requestId: string): Promise<APIResponse<ShareResponsePayload>> => {
  try {
    console.log("shareEndpoint: Requesting share link for requestId:", requestId);
    const response = await fetchAPI<APIResponse<ShareResponsePayload>>(`${PUBLIC_SHARE_LINK}/by-request/${requestId}`, {
      method: "POST",
      body: JSON.stringify({}), 
    });
    console.log("shareEndpoint: Raw response received:", response);
    if (response.success) {
      if (response.payload && typeof response.payload === "string") {
        return { ...response, payload: { token: response.payload } } as APIResponse<ShareResponsePayload>;
      } else {
        throw new Error("No valid URL found in response payload");
      }
    } else {
      throw new Error(`Failed to generate share link: ${response.message || "Unknown error"}`);
    }
  } catch (error) {
    console.error("shareEndpoint Error:", error);
    throw error;
  }
};



// Verify token 
export const verifyToken = async (token: string) => {
  try {
    console.log("verifyToken: Verifying token:", token);
    const response = await fetchAPI(`${PUBLIC_SHARE_LINK}/verify-token/${token}`, {
      method: "GET",
    }); 
    console.log("verifyToken: Raw response received:", JSON.stringify(response, null, 2));
    if (!response.success) {
      console.warn("verifyToken: Token verification failed:", response.message);
      return null;
    }
    return response.payload;
  } catch (error) {
    console.error("verifyToken Error:", error);
    return null;
  }
};


//get project link
export const shareProject = async (
  projectId: string,
  collectionId?: string,
  requestId?: string
): Promise<APIResponse<ShareResponsePayload>> => {
  try {
    console.log("shareProject: Requesting share link for projectId:", projectId, "collectionId:", collectionId, "requestId:", requestId);
    const response = await fetchAPI<APIResponse<ShareResponsePayload>>(
      `${PUBLIC_SHARE_LINK}/by-project/${projectId}`,
      {
        method: "POST",
        body: JSON.stringify({ collectionId, requestId }),
      }
    );
    console.log("shareProject: Raw response received:", response);
    if (response.success && response.payload && typeof response.payload === "string") {
      const tokenUrl = new URL(response.payload);
      tokenUrl.searchParams.append("projectId", projectId);
      if (collectionId) tokenUrl.searchParams.append("collectionId", collectionId);
      if (requestId) tokenUrl.searchParams.append("requestId", requestId);
      const finalUrl = tokenUrl.toString();
      console.log("shareProject: Generated public share link:", finalUrl);
      return { ...response, payload: { token: finalUrl } };
    }
    throw new Error(`Failed to generate share link: ${response.message || "Unknown error"}`);
  } catch (error) {
    console.error("shareProject Error:", error);
    throw error;
  }
};