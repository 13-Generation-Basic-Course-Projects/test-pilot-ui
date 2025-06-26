import { fetchAPI } from "@/lib/api";
import { COLLECTION_ENDPOINT, PROJECT_ENDPOINT } from "@/lib/static";
import { CollectionItem, NewProjectPayload } from "@/types";
import {
	CollectionResponseType,
	CollectionResponseTypes,
} from "@/types/collection-type";
import { getSession } from "next-auth/react";
export interface VerifyResponse {
	success: boolean;
	message: string;
	payload?: any[];
	[key: string]: any;
}
//Get ll
export const getAllCollection = async (
	projectId: string
): Promise<CollectionItem[]> => {
	try {
		const response = await fetchAPI<CollectionResponseTypes>(
			`${COLLECTION_ENDPOINT}/by-project/${projectId}`, {
                next: {tags: ["collection"]}
            }
		);
        console.log("Response :", response.payload);
		if (response.success && response.payload) {
			return response.payload.map((item: any) => ({
				id: item.id,
				title: item.name,
				endpoints: [],
			}));
		}
		return [];
	} catch (error) {
		console.error(
			`Failed to fetch collections for project ${projectId}:`,
			error
		);
		return [];
	}
};

// Delete Collection By ID
export const deleteCollectionByIdService = async (
	collectionId: string
): Promise<void> => {
	await fetchAPI(`${COLLECTION_ENDPOINT}/${collectionId}`, {
		method: "DELETE",
	});
};

//Create Collection in project
export const createCollectionService = async (
	name: string,
	projectId: string
) => {
	try {
		return await fetchAPI(`${COLLECTION_ENDPOINT}`, {
			method: "POST",
			body: JSON.stringify({ name, projectId }),
		});


	} catch (error) {
		throw new Error("Failed to create collection");
	}
};

// Duplicate collection
export const duplicateCollectionService = async (data: {
	name: string;
	projectId: string;
}): Promise<CollectionResponseType> => {
	const response = await fetchAPI<CollectionResponseType>(COLLECTION_ENDPOINT, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	return response.payload;
};

// rename collection
export const renameCollectionService = async (
	collectionId: string,
	data: { name: string; projectId: string }
): Promise<CollectionResponseType> => {
	const response = await fetchAPI<CollectionResponseType>(
		`${COLLECTION_ENDPOINT}/${collectionId}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		}
	);
	return response.payload;
};

// Share Collection By CollectionId
export async function fetchShareLink(
	collectionId: string
): Promise<string | null> {
	try {
		// Get the current user session
		const session = await getSession();
		const authToken = session?.accessToken;
		if (!authToken) {
			console.warn("No access token in session");
			return null;
		}
		const response = await fetch(
			`https://testpilot.yamu.me/api/v1/public-share-link/by-collection/${collectionId}`,
			{
				method: "POST",
				headers: {
					Accept: "*/*",
					Authorization: `Bearer ${authToken}`,
				},
				body: "",
			}
		);
		const result = await response.json();
		return result.payload || null;
	} catch (error) {
		console.error("Failed to fetch share link:", error);
		return null;
	}
}
// Verify Token For Share link
export async function verifyShareToken(token: string): Promise<VerifyResponse> {
	try {
		const session = await getSession();
		const authToken = session?.accessToken;
		// const authToken = localStorage.getItem("token");
		if (!authToken) throw new Error("Missing authentication token");

		const response = await fetch(
			`https://testpilot.yamu.me/api/v1/public-share-link/verify-token/${token}`,
			{
				method: "GET",
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${authToken}`,
				},
			}
		);

		if (!response.ok) {
			throw new Error("Invalid or expired token.");
		}
		const data = await response.json();
		return data as VerifyResponse;
	} catch (error) {
		console.error("verifyShareToken error:", error);
		throw error;
	}
}
