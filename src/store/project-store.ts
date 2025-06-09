import type { Project } from "@/types";
import { create } from "zustand";

// --- DEFAULT DATA ---
// This is the static project data you provided. We keep it here as a default fallback.
const projectsData: Project[] = [
	{
		id: "project-1",
		iconType: "folder",
		title: "My Awesome Project",
		description: "This is a description for My Awesome Project.",
		creationDate: "June 3, 2025",
		userAvatarUrl: "/profile-img.png",
		name: "My Awesome Project",
		collections: [
			{
				id: "collection-users",
				title: "User Management",
				description: "Manage application users",
				endpoints: [
					{
						id: "endpoint-users-1",
						method: "GET",
						path: "/api/v1/users",
						description: "Get all users",
						url: "http://localhost:3000/api/v1/users",
						status: 200,
						statusText: "OK",
					},
					{
						id: "endpoint-users-2",
						method: "POST",
						path: "/api/v1/users",
						description: "Create a new user",
						url: "http://localhost:3000/api/v1/users",
						status: 201,
						statusText: "Created",
					},
				],
			},
			{
				id: "collection-inventory",
				title: "Inventory",
				description: "Manage stock levels for products",
				endpoints: [
					{
						id: "endpoint-inventory-1",
						method: "GET",
						path: "/api/v1/inventory/{productId}",
						description: "Get stock level for a product",
						url: "http://localhost:3000/api/v1/inventory/{productId}",
						status: 200,
						statusText: "OK",
					},
					{
						id: "endpoint-inventory-2",
						method: "PUT",
						path: "/api/v1/inventory/{productId}",
						description: "Update stock level for a product",
						url: "http://localhost:3000/api/v1/inventory/{productId}",
						status: 200,
						statusText: "OK",
					},
				],
			},
			{
				id: "collection-products",
				title: "Product Catalog",
				description: "Manage products in the catalog",
				endpoints: [
					{
						id: "endpoint-products-1",
						method: "GET",
						path: "/api/v1/products",
						description: "Get all products",
						url: "http://localhost:3000/api/v1/products",
						status: 200,
						statusText: "OK",
					},
					{
						id: "endpoint-products-2",
						method: "POST",
						path: "/api/v1/products",
						description: "Create a new product",
						url: "http://localhost:3000/api/v1/products",
						status: 201,
						statusText: "Created",
					},
					{
						id: "endpoint-products-3",
						method: "GET",
						path: "/api/v1/products/{id}",
						description: "Get product by ID",
						url: "http://localhost:3000/api/v1/products/{id}",
						status: 200,
						statusText: "OK",
					},
				],
			},
		],
	},
];

// Define the state and actions for our store
interface ProjectState {
	project: Project | null;
	setProjectByProjectId: (projectId: string) => void;
	updateProject: (updater: (project: Project) => Project) => void;
	updateEndpoint: (requestId: string, newMethod: string) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
	project: null,

	setProjectByProjectId: (projectId) => {
		if (!projectId) {
			set({ project: null });
			return;
		}
		try {
			const projectKey = `project-data-${projectId}`;

			// --- FIX: AUTOMATIC SEEDING LOGIC ---
			// 1. Check if data already exists in localStorage.
			let savedProjectJSON = localStorage.getItem(projectKey);

			console.log("saved", savedProjectJSON);

			// 2. If it DOESN'T exist, find it in our default data and save it.
			if (!savedProjectJSON) {
				const projectToSeed = projectsData.find((p) => p.id === projectId);
				if (projectToSeed) {
					console.log(
						`Project data for '${projectId}' not found in localStorage. Seeding default data.`
					);
					savedProjectJSON = JSON.stringify(projectToSeed);
					localStorage.setItem(projectKey, savedProjectJSON);
				}
			}
			// --- END OF FIX ---

			// 3. Now, parse and set the data (which is guaranteed to be there if it was in our default data)
			const projectData = savedProjectJSON
				? JSON.parse(savedProjectJSON)
				: null;
			if (projectData) {
				set({ project: projectData });
			} else {
				console.error(
					`Project with ID '${projectId}' could not be found to load or seed.`
				);
				set({ project: null });
			}
		} catch (error) {
			console.error("Failed to load project from localStorage:", error);
			set({ project: null });
		}
	},

	updateProject: (updater) => {
		const currentProject = get().project;
		if (!currentProject) return;

		const updatedProject = updater(currentProject);
		set({ project: updatedProject });

		try {
			const projectKey = `project-data-${updatedProject.id}`;
			localStorage.setItem(projectKey, JSON.stringify(updatedProject));
		} catch (error) {
			console.error("Failed to save project to localStorage:", error);
		}
	},

	updateEndpoint: (requestId, newMethod) => {
		const { updateProject } = get();
		updateProject((project) => {
			const newCollections = project.collections.map((collection) => {
				const endpointIndex = collection.endpoints.findIndex(
					(ep) => ep.id === requestId
				);
				if (endpointIndex !== -1) {
					const newEndpoints = [...collection.endpoints];
					newEndpoints[endpointIndex] = {
						...newEndpoints[endpointIndex],
						method: newMethod,
					};
					return { ...collection, endpoints: newEndpoints };
				}
				return collection;
			});
			return { ...project, collections: newCollections };
		});
	},
}));
