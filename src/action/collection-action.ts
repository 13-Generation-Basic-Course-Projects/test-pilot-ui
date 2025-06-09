"use server";
import { fetchAPI } from "@/lib/api";
import { COLLECTION_ENDPOINT } from "@/lib/static";
import {
	createCollectionService,
	deleteCollectionByIdService,
	getAllCollection,
} from "@/service/collection-service";
import { CollectionItem } from "@/types";

export const fetchCollectionsForProject = async (
	projectId: string
): Promise<CollectionItem[]> => {
	return await getAllCollection(projectId);
};

export const deleteCollectionAction = async (collectionId: string) => {
	await deleteCollectionByIdService(collectionId);
};

//  Creates a new collection
export const createCollectionAction = async (
	title: string,
	projectId: string
) => {
	const newCollectionFromAPI = await createCollectionService(title, projectId);
};
