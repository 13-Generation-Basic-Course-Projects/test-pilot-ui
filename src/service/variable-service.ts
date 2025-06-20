// @/service/variable-service.ts
import { fetchAPI } from "@/lib/api";
import { VARIABLE_ENDPOINT } from "@/lib/static";
import { VariableResponseTypes } from "@/types/project-variable-type";

export const getAllProjectVariable = async (projectId: string) => {
    try {
        const response = await fetchAPI<VariableResponseTypes>(`${VARIABLE_ENDPOINT}/project/${projectId}`);
        console.log("API Response:", response);
        if (response.success) {
            return response.payload; 
        } else {
            const errorMsg = response.message || "Unknown API error occurred";
            throw new Error(errorMsg);
        }
    } catch (error) {
        throw error;
    }
};