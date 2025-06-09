"use server";
import { fetchAPI } from "@/lib/api";
import { COLLECTION_ENDPOINT } from "@/lib/static";
import {
  createCollectionService,
  deleteCollectionByIdService,
  duplicateCollectionService,
  getAllCollection,
} from "@/service/collection-service";
import { CollectionItem, ProjectItem } from "@/types";
import { CollectionResponseType } from "@/types/collection-type";
import { toast } from "sonner";

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

// Duplicate collection

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
