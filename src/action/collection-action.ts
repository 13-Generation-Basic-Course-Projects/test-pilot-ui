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
	revalidateTag("collection");
	return res.payload;
};

// export const duplicateCollectionAction = async (
// 	collection: CollectionItem,
// 	projectId: string
// ): Promise<CollectionItem | null> => {
// 	try {
// 		const duplicatedName = `${collection.title} Copy`;
// 		const newCollection = await duplicateCollectionService({
// 			name: duplicatedName,
// 			projectId,
// 		});
// 		return {
// 			id: newCollection.id,
// 			title: newCollection.name,
// 			endpoints: [],
// 		};
// 	} catch (error) {
// 		console.error("Duplicate Collection Failed:", error);
// 		return null;
// 	}
// };

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
