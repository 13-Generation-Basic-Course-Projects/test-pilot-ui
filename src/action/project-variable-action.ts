"use server";

import {
  deleteVariableById,
  getAllProjectVariable,
} from "@/service/variable-service";
import { ProjectVariableItem } from "@/types";

// Fetch project variables
export async function getAllProjectVariableAction(
  projectId: string
): Promise<ProjectVariableItem[]> {
  try {
    const payload = await getAllProjectVariable(projectId);

    // Check to ensure payload is an array.
    if (!Array.isArray(payload)) {
      throw new Error("Unexpected response format: payload is not an array");
    }

    const mappedVariables = payload.map(
      (item: { variableId: string; keyName: string; keyValue: string }) => ({
        variableId: item.variableId,
        variable: item.keyName,
        value: item.keyValue,
      })
    );

    return mappedVariables;
  } catch (error) {
    throw new Error(
      "Failed to fetch project variables: " + (error as Error).message
    );
  }
}

// Delete variable action
export async function dele(variableId: string) {
  try {
    return await deleteVariableById(variableId);
  } catch (error) {
    throw new Error("Delete failed: " + (error as Error).message);
  }
}
