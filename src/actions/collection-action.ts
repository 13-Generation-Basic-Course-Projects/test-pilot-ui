"use server"
import { getAllCollection } from "@/service/collection-service";
import { CollectionItem } from "@/types";

export const fetchCollectionsForProject = async (projectId: string): Promise<CollectionItem[]> => {
  return await getAllCollection(projectId);
};
