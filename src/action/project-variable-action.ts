"use server"

import {
  createProjectVariableService,
  deleteVariableById,
  getAllProjectVariable,
  updateProjectVariable,
  toggleAllVariablesForProject,
} from "@/service/variable-service"

interface SimplifiedVariable {
  variableId: string
  variable: string
  value: string
  enabled: boolean
}

export async function getAllProjectVariableAction(projectId: string, token?: string): Promise<SimplifiedVariable[]> {
  try {
    const payload = await getAllProjectVariable(projectId, token)
    return payload.map(item => ({
      variableId: item.variableId,
      variable: item.keyName,
      value: item.keyValue,
      enabled: item.enabled
    }))
  } catch (error) {
    // console.error("Failed to fetch variables:", error)
    return [];
  }
}

export async function deleteVariableByIdAction(variableId: string, token?: string): Promise<void> {
  try {
    await deleteVariableById(variableId, token)
  } catch (error) {
    console.error("Failed to delete variable:", error)
    throw new Error("Failed to delete variable")
  }
}

export async function createVariableAction(
  data: {
    name: string
    value: string
    enabled?: boolean
    projectId: string
  },
  token?: string
): Promise<SimplifiedVariable> {
  try {
    const result = await createProjectVariableService({
      name: data.name,
      value: data.value,
      projectId: data.projectId,
      enabled: data.enabled ?? true
    }, token)

    return {
      variableId: result.variableId,
      variable: result.keyName,
      value: result.keyValue,
      enabled: result.enabled
    }
  } catch (error) {
    // console.error("Failed to create variable:", error)
    throw new Error("Failed to create variable")
  }
}

export async function updateProjectVariableAction(
  variableId: string,
  payload: {
    keyName: string
    keyValue: string
    enabled: boolean
    projectId: string
  },
  token?: string
): Promise<SimplifiedVariable> {
  try {
    const result = await updateProjectVariable(variableId, payload, token)
    const resultItem = Array.isArray(result) ? result[0] : result
    return {
      variableId: resultItem.variableId,
      variable: resultItem.keyName,
      value: resultItem.keyValue,
      enabled: resultItem.enabled
    }
  } catch (error) {
    // console.error("Failed to update variable:", error)
    throw new Error("Failed to update variable")
  }
}

export async function toggleAllProjectVariablesAction(
  projectId: string,
  isEnabled: boolean,
  token?: string
): Promise<void> {
  try {
    await toggleAllVariablesForProject(projectId, isEnabled, token)
  } catch (error) {
    // console.error("Failed to toggle variables:", error)
    throw new Error("Failed to toggle variables")
  }
}