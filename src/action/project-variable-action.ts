"use server";

import { getAllProjectVariable } from "@/service/variable-service";
import { ProjectVariableItem } from "@/types";

export async function getAllProjectVariableAction(projectId: string): Promise<ProjectVariableItem[]> {

    try {
        const payload = await getAllProjectVariable(projectId);

        const mappedVariables = payload.map((item: { keyName: any; keyValue: any; }) => ({
            variable: item.keyName,
            value: item.keyValue,
        }));

        return mappedVariables; 
    } catch (error) {
        throw new Error("Failed to fetch project variables: " + (error as Error).message);
    }
}