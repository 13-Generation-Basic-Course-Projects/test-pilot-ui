import { fetchAPI } from "@/lib/api";
import { PROJECT_ENDPOINT } from "@/lib/static";
import { ProjectResponseType } from "@/types/project-type";

export const getAllProjectService = async () => {
	const data = await fetchAPI<ProjectResponseType>(`${PROJECT_ENDPOINT}`);
	return data.data;
};
