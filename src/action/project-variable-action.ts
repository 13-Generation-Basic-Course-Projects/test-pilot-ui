"use server";

import {
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

// //  Add variable
// export async function createVariableAction(payload: {
//   keyName: string;
//   keyValue: string;
//   enabled: boolean;
//   projectId: string;
// }) {
//   try {
//     const result = await createProjectVariable(payload);

//     if (result[0].variableId) {
//       return { variableId: result[0].variableId };
//     } else {
//       throw new Error("Failed to get variableId from response array.");
//     }
//   } catch (error) {
//     throw new Error("Create failed: " + (error as Error).message);
//   }
// }
