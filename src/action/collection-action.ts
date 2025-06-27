"use server";

import {
  createCollectionService,
  deleteCollectionByIdService,
  duplicateCollectionService,
  getAllCollection,
  renameCollectionService,
} from "@/service/collection-service";
import { CollectionItem } from "@/types";
import { revalidateTag } from "next/cache";
import { createRequestByCollectionIdAction } from "./request-action";
import {
  createRequestByCollectionId,
  getRequestByCollectionId,
} from "@/service/request-service";

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
  revalidateTag("collection");
  return res.payload;
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

function generateCopyName(name: string, existingTitles: string[]): string {
  const baseRegex = /^(.*?)(?: Copy(?:([0-9]+))?)?$/i;
  const match = name.match(baseRegex);

  if (!match) return `${name} Copy`;

  const baseName = match[1].trim();

  // Collect all matching titles that follow the copy pattern
  const matchingCopies = existingTitles.filter((title) => {
    const m = title.match(baseRegex);
    return m && m[1].trim() === baseName;
  });

  // Find the highest existing copy number
  let maxCopy = 0;
  for (const title of matchingCopies) {
    const m = title.match(baseRegex);
    const copyNum = m?.[2]
      ? parseInt(m[2], 10)
      : m?.[0].toLowerCase().endsWith("copy")
      ? 1
      : 0;
    if (copyNum > maxCopy) {
      maxCopy = copyNum;
    }
  }

  const nextCopyNumber = maxCopy + 1;
  return nextCopyNumber === 1
    ? `${baseName} Copy`
    : `${baseName} Copy${nextCopyNumber}`;
}

export const duplicateCollectionAction = async (
  collection: CollectionItem,
  projectId: string,
  existingCollections: CollectionItem[]
): Promise<CollectionItem | null> => {
  try {
    const existingTitles = existingCollections.map((c) => c.title);
    const duplicatedName = generateCopyName(collection.title, existingTitles);
    // Create new collection
    const newCollection = await duplicateCollectionService({
      name: duplicatedName,
      projectId,
    });
    // Get original requests
    const originalRequests = await getRequestByCollectionId({
      collectionId: collection.id,
    });
    const normalizeDetails = (details: any) => ({
      url: details?.url ?? "",
      pathVariables:
        typeof details?.pathVariables === "object" ? details.pathVariables : {},
      queryParams:
        typeof details?.queryParams === "object" ? details.queryParams : {},
      headers:
        typeof details?.headers === "object"
          ? details.headers
          : typeof details?.header === "object"
          ? details.header
          : {},
      body: details?.body ?? null,
      description: details?.description ?? "",
    });
    // Duplicate each request with normalized data
    await Promise.all(
      originalRequests.map((req) =>
        createRequestByCollectionId({
          collectionId: newCollection.id,
          name: req.name || "Untitled",
          method: req.method ?? "GET",
          details: normalizeDetails(req.details),
        })
      )
    );
    const duplicatedRequests = await getRequestByCollectionId({
      collectionId: newCollection.id,
    });
    return {
      id: newCollection.id,
      title: newCollection.name,
      endpoints: duplicatedRequests.map((req) => ({
        ...req,
        method: req.method ?? "GET",
        path: req.path ?? "",
        details: normalizeDetails(req.details),
      })),
    };
  } catch (error) {
    console.error("Duplicate Collection Failed:", error);
    return null;
  }
};
