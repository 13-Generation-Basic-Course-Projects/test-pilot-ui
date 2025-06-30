import { fetchAPI } from "@/lib/api";
import { VARIABLE_ENDPOINT } from "@/lib/static";
import { ProjectVariableItem } from "@/types";

// --- Types ---
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

export type VariableResponseSingle = {
  keyValue: string;
  keyName: string;
  variableId: string;
  success: boolean;
  message: string;
  status: string;
  timestamps?: string;
  payload: VariableItem;
};

export type VariableResponseTypes = {
  success: boolean;
  message: string;
  status: string;
  timestamps?: string;
  payload: VariableItem[];
};

// --- API functions ---

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

// Delete a variable by ID
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

// Create a new project variable
export const createProjectVariableService = async (data: {
  name?: string;
  value?: string;
  projectId?: string;
}): Promise<{
  variableId: string;
  variable: string;
  value: string;
}> => {
  const response = await fetchAPI<VariableResponseSingle>(
    `${VARIABLE_ENDPOINT}`,
    {
      method: "POST",
      body: JSON.stringify({
        keyName: data.name,
        keyValue: data.value,
        enabled: true,
        projectId: data.projectId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const variable = response.payload;

  if (!response.success || !variable?.variableId) {
    throw new Error("API did not return expected variable");
  }

  return {
    variableId: variable.variableId,
    variable: variable.keyName,
    value: variable.keyValue,
  };
};

// Update an existing variable
export const updateProjectVariable = async (
  variableId: string,
  data: {
    keyName: string;
    keyValue: string;
    enabled: boolean;
    projectId: string;
  }
): Promise<VariableItem[]> => {
  const response = await fetchAPI<VariableResponseTypes>(
    `${VARIABLE_ENDPOINT}/${variableId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.success || !Array.isArray(response.payload)) {
    throw new Error("Failed to update variable: " + response.message);
  }

  return response.payload;
};
