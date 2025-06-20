import { fetchAPI } from "@/lib/api";
import { VARIABLE_ENDPOINT } from "@/lib/static";
export type CreateVariablePayload = {
  keyName: string;
  keyValue: string;
  enabled: boolean;
  projectId: string;
};

export type VariableItem = {
  variableId: string;
  keyName: string;
  keyValue: string;
  enabled: boolean;
  project: {
    projectId: string;
    projectName: string;
    projectDescription: string;
    projectOwner: {
      userId: string;
      name: string;
      email: string;
      password: string;
      isVerified: boolean;
      profileImage: string | null;
      username: string;
      authorities: string[] | null;
      enabled: boolean;
      accountNonExpired: boolean;
      accountNonLocked: boolean;
      credentialsNonExpired: boolean;
    };
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
};

export type VariableResponseTypes = {
  success: boolean;
  message: string;
  status: string;
  timestamps?: string;
  payload: VariableItem[];
};

// API Functions
// Get all variables for a project
export const getAllProjectVariable = async (
  projectId: string
): Promise<VariableItem[]> => {
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
