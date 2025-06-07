"use server";
import { fetchAPI } from "@/lib/api";
import { COLLECTION_ENDPOINT } from "@/lib/static";
import {
  createCollectionService,
  deleteCollectionByIdService,
  getAllCollection,
  renameCollectionService,
} from "@/service/collection-service";
import { CollectionItem, ProjectItem } from "@/types";
import { CollectionResponseType } from "@/types/collection-type";
import { revalidatePath } from "next/cache";

export const fetchCollectionsForProject = async (
  projectId: string
): Promise<CollectionItem[]> => {
  return await getAllCollection(projectId);
};

export const deleteCollectionAction = async (
  collectionId: string,
  projectId: string
) => {
  await deleteCollectionByIdService(collectionId);
};
//  Creates a new collection
export const createCollectionAction = async (
  title: string,
  projectId: string
): Promise<CollectionItem> => {
  const newCollectionFromAPI = await createCollectionService(title, projectId);

  return {
    id: newCollectionFromAPI.id,
    title: newCollectionFromAPI.name,
    endpoints: [],
  };
};
// rename collection
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