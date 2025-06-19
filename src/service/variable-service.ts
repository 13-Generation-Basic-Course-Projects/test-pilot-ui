import { fetchAPI } from "@/lib/api";
import { VARIABLE_ENDPOINT } from "@/lib/static";
import { VariableResponseTypes } from "@/types/project-variable-type";

// Get all project variables
export const getAllProjectVariable = async (projectId: string) => {
  try {
    const response = await fetchAPI<VariableResponseTypes>(
      `${VARIABLE_ENDPOINT}/project/${projectId}`
    );
    if (response.success) {
      return response.payload;
    } else {
      throw new Error(response.message || "Unknown API error occurred");
    }
  } catch (error) {
    throw error;
  }
};

// Delete variable by ID
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
    throw error;
  }
};
