"use server";

import {
	createCollectionService,
	deleteCollectionByIdService,
	duplicateCollectionService,
	getAllCollection,
	renameCollectionService,
} from "@/service/collection-service";
import { CollectionItem } from "@/types";
import {revalidateTag} from "next/cache";

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
	const res = await createCollectionService(title, projectId);
	console.log("000000000000000000000000"  + JSON.stringify(res));
	revalidateTag("collection");
	return res.payload;
};

export const duplicateCollectionAction = async (
	collection: CollectionItem,
	projectId: string
): Promise<CollectionItem | null> => {
	try {
		const duplicatedName = `${collection.title} Copy`;
		const newCollection = await duplicateCollectionService({
			name: duplicatedName,
			projectId,
		});
		return {
			id: newCollection.id,
			title: newCollection.name,
			endpoints: [],
		};
	} catch (error) {
		console.error("Duplicate Collection Failed:", error);
		return null;
	}
};

export const renameCollectionAction = async (
	projectId: string,
	collectionId: string,
	newTitle: string
): Promise<void> => {
	try {
		await renameCollectionService(collectionId, {
			name: newTitle,
			projectId: projectId,
		});
	} catch (error) {
		console.error("Failed to rename collection:", error);
		throw error;
	}
};
