"use server";

import {
  createProjectVariableService,
  deleteVariableById,
  getAllProjectVariable,
  updateProjectVariable,
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

// update project variable
export async function updateProjectVariableAction(
  variableId: string,
  payload: {
    keyName: string;
    keyValue: string;
    enabled: boolean;
    projectId: string; 
  }
): Promise<SimplifiedVariable> {
  try {
    if (!variableId) {
      throw new Error("variableId is required");
    }
    if (!payload.keyName || !payload.keyValue || !payload.projectId) {
      throw new Error("keyName, keyValue, and projectId are required");
    }

    const result = await updateProjectVariable(variableId, payload);

    // console.log("Update action result:", result);

    if (!result[0]) {
      throw new Error("Unexpected response format: empty payload");
    }

    return {
      variableId: result[0].variableId,
      variable: result[0].keyName,
      value: result[0].keyValue,
    };
  } catch (error) {
    console.error("Update action error:", error);
    throw new Error("Update failed: " + (error as Error).message);
  }
}