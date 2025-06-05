"use server";
import {
  deleteCollectionByIdService,
  getAllCollection,
} from "@/service/collection-service";
import { CollectionItem, ProjectItem } from "@/types";

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
