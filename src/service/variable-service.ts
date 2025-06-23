import { fetchAPI } from "@/lib/api";
import { VARIABLE_ENDPOINT } from "@/lib/static";
import { ProjectVariableItem } from "@/types";
import { VariableResponseTypes } from "@/types/project-variable-type";
export type CreateVariablePayload = {
  keyName: string;
  keyValue: string;
  enabled: boolean;
  projectId: string;
};

// API Functions
// Get all variables for a project
export const getAllProjectVariable = async (
  projectId: string
): Promise<ProjectVariableItem[]> => {
  try {
    const response = await fetchAPI<VariableResponseTypes>(
      `${VARIABLE_ENDPOINT}/project/${projectId}`
    );
    if (response.success && Array.isArray(response.payload)) {
      return response.payload;
    } else {
      throw new Error(response.message || "Unknown API error occurred");
    }
  } catch (error) {
    throw new Error("Fetch failed: " + (error as Error).message);
  }
};

//  Delete a variable by ID
export const deleteVariableById = async (variableId: string) => {
  try {
    const response = await fetchAPI<VariableResponseTypes>(
      `${VARIABLE_ENDPOINT}/${variableId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.success) {
      throw new Error(response.message || "Failed to delete variable");
    }
    return response;
  } catch (error) {
    throw new Error("Delete failed: " + (error as Error).message);
  }
};

// //  Create a new variable (returns array of created variable(s))
// export const createProjectVariable = async (
//   payload: CreateVariablePayload
// ): Promise<VariableItem[]> => {
//   try {
//     const response = await fetchAPI<VariableResponseTypes>(
//       `${VARIABLE_ENDPOINT}/create`, // Make sure this is the correct endpoint
//       {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (response.success && Array.isArray(response.payload)) {
//       return response.payload;
//     } else {
//       throw new Error(response.message || "Variable creation failed.");
//     }
//   } catch (error) {
//     throw new Error("Create failed: " + (error as Error).message);
//   }
// };


// update project variable
export const updateProjectVariable = async (
  variableId: string,
  payload: Partial<CreateVariablePayload>
): Promise<ProjectVariableItem[]> => {
  const response = await fetchAPI<VariableResponseTypes>(
    `${VARIABLE_ENDPOINT}/${variableId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  // console.log("Update API response:", response);

  if ("success" in response && response.success) {
    const payloadData = Array.isArray(response.payload) ? response.payload : [response.payload];
    return payloadData.map((item: { variableId: any; keyName: any; keyValue: any; enabled: any; }) => ({
      id: item.variableId, 
      variableId: item.variableId,
      keyName: item.keyName,
      keyValue: item.keyValue,
      enabled: item.enabled,
    }));
  }

  return [];
};