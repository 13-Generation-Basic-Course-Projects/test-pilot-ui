"use server";
import {
	createProjectService,
	deleteProjectByIdService,
	getAllProjectService,
	updateProjectByIdService,
} from "@/service/project-service";
import { ProjectItem } from "@/types";

//Delete rpoject
export const deleteProjectAction = async (
	projectId: string
): Promise<ProjectItem[]> => {
	await deleteProjectByIdService(projectId);

	const projects = await getAllProjectService();
	return projects.map((project) => ({
		id: project.id,
		title: project.title,
		description: project.description,
		creationDate: new Date(project.creationDate).toLocaleDateString(),
		userAvatarUrl: "/defaultAvatar.png",
	}));
};

//Create Project
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
		// userAvatarUrl: project.projectOwner?.profileImage || "/defaultAvatar.png",
	};
};

//Update project
export const updateProjectByIdAction = async (
	projectId: string,
	payload: { projectName: string; projectDescription: string }
): Promise<ProjectItem | null> => {
	const response = await updateProjectByIdService(projectId, {
		title: payload.projectName,
		description: payload.projectName,
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

export const getProjectAction = async () => {
	const response = await getAllProjectService();
	return response;
};
