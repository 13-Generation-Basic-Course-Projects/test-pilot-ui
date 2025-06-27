"use server";

import {
  createProjectVariableService,
  // createProjectVariable,
  deleteVariableById,
  getAllProjectVariable,
} from "@/service/variable-service";

// Define the correct shape for simplified variables
type SimplifiedVariable = {
	variableId: string;
	variable: string;
	value: string;
};

// Fetch project variables
export async function getAllProjectVariableAction(
	projectId: string
): Promise<SimplifiedVariable[]> {
	try {
		const payload = await getAllProjectVariable(projectId);

		if (!Array.isArray(payload)) {
			throw new Error("Unexpected response format: payload is not an array");
		}

		const mappedVariables = payload.map((item) => ({
			variableId: item.variableId,
			variable: item.keyName,
			value: item.keyValue,
		}));

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

// Create new project variable with auto save
export async function createVariableAction(data: {
  name?: string;
  value?: string;
  enabled?: boolean;
  projectId?: string;
}) {
  console.log("createVariableAction called with data:", data);

  try {
    if (!data.name || !data.value || !data.projectId) {
      throw new Error("Missing required fields");
    }

    const result = await createProjectVariableService(data); // ✅ correct call

    return result;
  } catch (err) {
    console.error("Error in createVariableAction:", err);
    throw new Error("Unable to create variable: " + (err as Error).message);
  }
}
