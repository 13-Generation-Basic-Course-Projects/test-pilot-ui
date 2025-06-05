import { fetchAPI } from "@/lib/api";
import { COLLECTION_ENDPOINT } from "@/lib/static";
import { CollectionItem } from "@/types";
import { CollectionResponseTypes } from "@/types/collection-type";

//Get ll 
export const getAllCollection = async (projectId: string): Promise<CollectionItem[]> => {
  try {
    const response = await fetchAPI<CollectionResponseTypes>(`${COLLECTION_ENDPOINT}/by-project/${projectId}`);
    if (response.success && response.payload) {
      return response.payload.map((item: any) => ({
        id: item.id,
        title: item.name,
        endpoints: [],
      }));
    }
    return [];
  } catch (error) {
    console.error(`Failed to fetch collections for project ${projectId}:`, error);
    return [];
  }
};

// Delete Collection By ID
export const deleteCollectionByIdService = async (collectionId: string): Promise<void> => {
  await fetchAPI(`${COLLECTION_ENDPOINT}/${collectionId}`, {
    method: "DELETE",
  });
};

