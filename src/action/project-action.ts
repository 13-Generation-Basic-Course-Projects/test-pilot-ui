
"use server";
import {
	createProjectService,
	deleteProjectByIdService,
	getAllProjectService,
	updateProjectByIdService,
} from "@/service/project-service";
import { ProjectItem } from "@/types";

// Delete project
export const deleteProjectAction = async (
	projectId: string
): Promise<ProjectItem[]> => {
	await deleteProjectByIdService(projectId);

	const projects = await getAllProjectService();
	return projects.projects.map((project) => ({
		id: project.id,
		title: project.title,
		description: project.description,
		creationDate: new Date(project.creationDate).toLocaleDateString(),
		userAvatarUrl: "/defaultAvatar.png",
	}));
};

// Create Project
export const createProjectAction = async (payload: {
	projectName: string;
	projectDescription: string;
}): Promise<ProjectItem | null> => {
	const response = await createProjectService({
		title: payload.projectName,
		description: payload.projectDescription,
	});

	const project = response;

	if (!project) return null;

	return {
		id: project.payload.projectId,
		title: project.payload.projectName,
		description: project.payload.projectDescription,
		creationDate: new Date(project.payload.createdAt).toLocaleDateString(),
		userAvatarUrl: project.payload.projectOwner?.profileImage || "/defaultAvatar.png",
	};
};

// Update project
export const updateProjectByIdAction = async (
	projectId: string,
	payload: { projectName: string; projectDescription: string }
): Promise<ProjectItem | null> => {
	const response = await updateProjectByIdService(projectId, {
		title: payload.projectName,
		description: payload.projectDescription,
	});

	const project = response;

	if (!project) {
		return {
			id: projectId,
			title: payload.projectName,
			description: payload.projectDescription,
			creationDate: new Date().toLocaleDateString(),
			userAvatarUrl: "/defaultAvatar.png",
		};
	}

	return {
		id: project.payload.projectId,
		title: project.payload.projectName,
		description: project.payload.projectDescription,
		creationDate: new Date(project.payload.createdAt).toLocaleDateString(),
		userAvatarUrl:
			project.payload.projectOwner?.profileImage || "/defaultAvatar.png",
	};
};

// Get all projects
export const getProjectAction = async (): Promise<ProjectItem[]> => {
	const response = await getAllProjectService();
	if (!response || !Array.isArray(response.projects)) {
		console.error("getAllProjectService did not return a valid projects array", response);
		return [];
	}
	return response.projects.map((project) => ({
		id: project.id,
		title: project.title,
		description: project.description,
		creationDate: new Date(project.creationDate).toLocaleDateString(),
		userAvatarUrl: project.userAvatarUrl || "/defaultAvatar.png",
	}));
};
