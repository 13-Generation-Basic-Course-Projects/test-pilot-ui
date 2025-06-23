import { fetchAPI } from "@/lib/api";
import { PROJECT_ENDPOINT } from "@/lib/static";
import {
	ProjectResponseType,
	ProjectResponseTypes,
} from "@/types/project-type";
import { NewProjectPayload, ProjectItem } from "@/types";

export const getAllProjectService = async (): Promise<ProjectItem[]> => {
	const response = await fetchAPI<ProjectResponseTypes>(`${PROJECT_ENDPOINT}`);

	if (!response?.payload.payload) return [];

	return response.payload.payload.map((project) => ({
		id: project.projectId,
		title: project.projectName,
		description: project.projectDescription,
		creationDate: new Date(project.createdAt).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "2-digit",
		}).replace(",", "/").replace(" ", "/"),
		userAvatarUrl: project.projectOwner?.profileImage || "/defaultAvatar.png",
	}));
};

// Delete project by ID
export const deleteProjectByIdService = async (
	projectId: string
): Promise<void> => {
	await fetchAPI(`${PROJECT_ENDPOINT}/${projectId}`, {
		method: "DELETE",
	});
};

//Create project
export const createProjectService = async ({
	title,
	description,
}: NewProjectPayload) => {
	const newProject = {
		projectName: title,
		projectDescription: description,
	};
	const response = await fetchAPI<ProjectResponseType>(`${PROJECT_ENDPOINT}`, {
		method: "POST",
		body: JSON.stringify(newProject),
	});

	return response;
};

// Update project
export const updateProjectByIdService = async (
	projectId: string,
	{ title, description }: NewProjectPayload
) => {
	const updateProject = {
		projectName: title,
		projectDescription: description,
	};

	const response = await fetchAPI<ProjectResponseType>(
		`${PROJECT_ENDPOINT}/${projectId}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updateProject),
		}
	);

	return response;
};
