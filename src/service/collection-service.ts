import { fetchAPI } from "@/lib/api";
import { COLLECTION_ENDPOINT, PROJECT_ENDPOINT } from "@/lib/static";
import { CollectionItem, NewProjectPayload } from "@/types";
import {
	CollectionResponseType,
	CollectionResponseTypes,
} from "@/types/collection-type";

//Get ll
export const getAllCollection = async (
	projectId: string
): Promise<CollectionItem[]> => {
	try {
		const response = await fetchAPI<CollectionResponseTypes>(
			`${COLLECTION_ENDPOINT}/by-project/${projectId}`
		);
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
		await fetchAPI(`${COLLECTION_ENDPOINT}`, {
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