import { fetchAPI } from "@/lib/api"
import { VARIABLE_ENDPOINT } from "@/lib/static"

interface ProjectReference {
  projectId: string
}

interface VariableItem {
  variableId: string
  keyName: string
  keyValue: string
  enabled: boolean
  project?: ProjectReference
}

interface BaseResponse {
  success: boolean
  message: string
  status: string
}

interface SingleVariableResponse extends BaseResponse {
  [x: string]: any
  payload: VariableItem
}

interface MultiVariableResponse extends BaseResponse {
  payload: VariableItem[]
}

interface EmptyResponse extends BaseResponse {
  payload: null
}

export const getAllProjectVariable = async (
  projectId: string, 
  token?: string
): Promise<VariableItem[]> => {
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`

  try {
    const response = await fetchAPI<MultiVariableResponse>(
      `${VARIABLE_ENDPOINT}/project/${projectId}`,
      { headers }
    )

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch variables")
    }

    if (!Array.isArray(response.payload)) {
      throw new Error("Invalid response format: expected array of variables")
    }

    return response.payload.map(item => ({
      variableId: item.variableId,
      keyName: item.keyName,
      keyValue: item.keyValue,
      enabled: item.enabled,
      project: item.project
    }))
  } catch (error) {
    console.error("Error in getAllProjectVariable:", error)
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Failed to fetch project variables"
    )
  }
}

export const deleteVariableById = async (
  variableId: string, 
  token?: string
): Promise<void> => {
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`

  try {
    const response = await fetchAPI<EmptyResponse>(
      `${VARIABLE_ENDPOINT}/${variableId}`,
      {
        method: "DELETE",
        headers
      }
    )

    if (!response.success) {
      throw new Error(response.message || "Failed to delete variable")
    }
  } catch (error) {
    console.error("Error in deleteVariableById:", error)
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Failed to delete variable"
    )
  }
}

export const createProjectVariableService = async (
  data: {
    name: string
    value: string
    projectId: string
    enabled?: boolean
  },
  token?: string
): Promise<VariableItem> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  }
  if (token) headers.Authorization = `Bearer ${token}`

  try {
    const response = await fetchAPI<SingleVariableResponse>(
      VARIABLE_ENDPOINT,
      {
        method: "POST",
        body: JSON.stringify({
          keyName: data.name,
          keyValue: data.value,
          enabled: data.enabled ?? true,
          projectId: data.projectId
        }),
        headers
      }
    )

    if (!response.success) {
      throw new Error(response.message || "Failed to create variable")
    }

    if (!response.payload?.variableId) {
      throw new Error("Invalid variable data received from server")
    }

    return {
      variableId: response.payload.variableId,
      keyName: response.payload.keyName,
      keyValue: response.payload.keyValue,
      enabled: response.payload.enabled,
      project: response.payload.project
    }
  } catch (error) {
    console.error("Error in createProjectVariableService:", error)
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Failed to create variable"
    )
  }
}

export const updateProjectVariable = async (
  variableId: string,
  data: {
    keyName: string
    keyValue: string
    enabled: boolean
    projectId: string
  },
  token?: string
): Promise<VariableItem> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  }
  if (token) headers.Authorization = `Bearer ${token}`

  try {
    const response = await fetchAPI<SingleVariableResponse>(
      `${VARIABLE_ENDPOINT}/${variableId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers
      }
    )

    if (!response.success) {
      throw new Error(response.message || "Failed to update variable")
    }

    if (!response.payload?.variableId) {
      throw new Error("Invalid variable data received from server")
    }

    return {
      variableId: response.payload.variableId,
      keyName: response.payload.keyName,
      keyValue: response.payload.keyValue,
      enabled: response.payload.enabled,
      project: response.payload.project
    }
  } catch (error) {
    console.error("Error in updateProjectVariable:", error)
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Failed to update variable"
    )
  }
}

export const toggleAllVariablesForProject = async (
  projectId: string,
  isEnabled: boolean,
  token?: string
): Promise<void> => {
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`

  try {
    const response = await fetchAPI<EmptyResponse>(
      `${VARIABLE_ENDPOINT}/project/${projectId}/enable?isEnabled=${isEnabled}`,
      {
        method: "PATCH",
        headers
      }
    )

    if (!response.success) {
      throw new Error(response.message || "Failed to toggle variables")
    }
  } catch (error) {
    console.error("Error in toggleAllVariablesForProject:", error)
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Failed to toggle variables"
    )
  }
}