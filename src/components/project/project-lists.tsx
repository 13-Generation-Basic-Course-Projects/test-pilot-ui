// components/project-lists.tsx
"use client";
import React, { useEffect, useState } from "react";
import { ProjectProps, ProjectItem } from "@/types";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	MoreHorizontal,
	CalendarPlus,
	ShareIcon,
	Trash2Icon,
	EditIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProjectForm from "./project-form";
import { DeleteProject } from "../delete/delete-project";
import { ShareProject } from "../share/share-project";
import { SearchForm } from "../search-form";
import { projectsData } from "@/lib/constants";

const ProjectLists = ({ searchQuery = "" }) => {
	// This state will hold all projects loaded from local storage
	const [projects, setProjects] = useState<ProjectItem[]>([]);

	const [selectedProjectForEdit, setSelectedProjectForEdit] =
		useState<ProjectItem | null>(null);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	const [selectedProjectForDelete, setSelectProjectForDelete] =
		useState<ProjectItem | null>(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const [selectedProjectForShare, setSelectedProjectForShare] =
		useState<ProjectItem | null>(null);
	const [isShareProjectOpen, setIsShareProjectOpen] = useState(false);

	// Effect to load projects from local storage on component mount
	useEffect(() => {
		try {
			const storedProjectsJSON = localStorage.getItem("projects");
			const storedProjects: ProjectItem[] = storedProjectsJSON
				? JSON.parse(storedProjectsJSON)
				: [];
			setProjects(storedProjects);
		} catch (error) {
			console.error("Failed to load projects from local storage:", error);
			setProjects([]); // Default to an empty array on error
		}
	}, []); // Empty dependency array ensures this runs only once

	useEffect(() => {
		try {
			const masterListJSON = localStorage.getItem("projects");

			// Check if local storage is empty or doesn't have projects
			if (!masterListJSON || masterListJSON === "[]") {
				// --- THIS IS THE NEW SEEDING LOGIC ---
				console.log("Local storage is empty. Seeding with initial data...");

				// 1. Prepare the master list (metadata like id, title, etc.)
				const masterListForStorage = projectsData.map((p) => ({
					id: p.id,
					title: p.title as string,
					description: p.description as string,
					creationDate: p.creationDate as string,
					userAvatarUrl: p.userAvatarUrl as string,
				}));
				localStorage.setItem("projects", JSON.stringify(masterListForStorage));

				// 2. Create a separate, detailed entry for EACH project from the constant
				projectsData.forEach((project) => {
					const projectKey = `project-data-${project.id}`;
					// Ensure the project from the constant has a `collections` property
					const projectWithCollections = {
						...project,
						// If your constant doesn't have `collections`, it will be added here
						collections: project.collections || [],
					};
					localStorage.setItem(
						projectKey,
						JSON.stringify(projectWithCollections)
					);
				});

				// 3. Set the component's state to display the seeded projects immediately
				setProjects(masterListForStorage);
				// --- END OF SEEDING LOGIC ---
			} else {
				// If data already exists, just load it as before
				const storedProjects: ProjectItem[] = JSON.parse(masterListJSON);
				setProjects(storedProjects);
			}
		} catch (error) {
			console.error(
				"Failed to load or seed projects from local storage:",
				error
			);
			setProjects([]); // Default to an empty array on any error
		}
	}, []);

	// Helper function to update both state and local storage
	const updateProjectsAndStorage = (updatedProjects: ProjectItem[]) => {
		setProjects(updatedProjects);
		localStorage.setItem("projects", JSON.stringify(updatedProjects));
	};

	const handleShare = (project: ProjectItem) => {
		setSelectedProjectForShare(project);
		setIsShareProjectOpen(true);
	};

	const handleDialogCloseShare = (open: boolean) => {
		setIsShareProjectOpen(open);
		if (!open) {
			setSelectedProjectForShare(null);
		}
	};

	const handleEditClick = (project: ProjectItem) => {
		setSelectedProjectForEdit(project);
		setIsEditDialogOpen(true);
	};

	const handleDialogClose = (open: boolean) => {
		setIsEditDialogOpen(open);
		if (!open) {
			setSelectedProjectForEdit(null);
		}
	};

	const handleDelete = (project: ProjectItem) => {
		setSelectProjectForDelete(project);
		setIsDeleteDialogOpen(true);
	};

	const handleDialogCloseDelete = (open: boolean) => {
		setIsDeleteDialogOpen(open);
		if (!open) {
			setSelectProjectForDelete(null);
		}
	};

	const deleteProject = async (projectId: string) => {
		const updatedProjects = projects.filter(
			(project) => project.id !== projectId
		);
		updateProjectsAndStorage(updatedProjects);
		console.log(
			`Project with ID: ${projectId} deleted from state and local storage.`
		);
	};

	const handleProjectCreated = (newProject: ProjectItem) => {
		const updatedProjects = [...projects, newProject];
		updateProjectsAndStorage(updatedProjects);
	};

	const handleProjectUpdated = (updatedProject: ProjectItem) => {
		const updatedProjects = projects.map((project) =>
			project.id === updatedProject.id ? updatedProject : project
		);
		updateProjectsAndStorage(updatedProjects);
	};

	// Filter projects based on the search query before rendering
	const filteredProjects = projects.filter((project) =>
		project.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<>
			<div className="mb-6 flex flex-col justify-between items-center">
				<div className="flex items-center justify-between w-full">
					<div>
						<h1 className="text-2xl">Projects</h1>
						<p className="text-slate-400 mt-2">
							Manage your API testing projects
						</p>
					</div>
					<ProjectForm mode="create" onProjectCreated={handleProjectCreated} />
				</div>
				<SearchForm className="mt-10" />
			</div>

			{/* Use the filteredProjects for rendering */}
			{filteredProjects.length === 0 ? (
				<div className="text-center text-slate-500 mt-10 justify-center">
					<p className="text-lg font-medium ">No projects found</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
					{filteredProjects.map((project) => (
						<Card key={project.id}>
							{/* Card content remains the same... */}
							<CardHeader>
								<div className="flex justify-between items-start">
									<Image
										src="/folderIcon.png"
										alt="folder-icon"
										width={50}
										height={50}
									/>
									<div>
										<DropdownMenu modal={false}>
											<DropdownMenuTrigger>
												<MoreHorizontal className="hover:bg-slate-400/10 rounded-md cursor-pointer" />
											</DropdownMenuTrigger>
											<DropdownMenuContent>
												<DropdownMenuItem
													onSelect={(e) => {
														e.preventDefault();
														handleShare(project);
													}}
												>
													<ShareIcon className="mr-2 h-4 w-4" />
													<span>Share</span>
												</DropdownMenuItem>

												<DropdownMenuSeparator />
												<DropdownMenuItem
													onSelect={(e) => {
														e.preventDefault();
														handleEditClick(project);
													}}
												>
													<EditIcon className="mr-2 h-4 w-4" />
													<span>Edit</span>
												</DropdownMenuItem>
												<DropdownMenuItem
													onSelect={(e) => {
														e.preventDefault();
														handleDelete(project);
													}}
												>
													<Trash2Icon className="mr-2 h-4 w-4 text-red-500" />
													<span className="text-red-500">Delete</span>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>
								<CardTitle className="mt-4">
									<h1 className="text-lg">{project.title}</h1>
								</CardTitle>
							</CardHeader>
							<Link href={`/project/${project.id}`}>
								<CardContent>
									<p className="text-clip line-clamp-2 h-12">
										{project.description}
									</p>
								</CardContent>
								<CardFooter className="flex justify-between items-center mt-4">
									<div className="flex items-center gap-2">
										<CalendarPlus className="text-slate-400 size-4" />
										<p className="text-sm text-slate-400">
											{project.creationDate || "N/A"}
										</p>
									</div>
									<Image
										src={project.userAvatarUrl || "/defaultAvatar.png"}
										alt="user profile"
										width={35}
										height={35}
										className="rounded-full"
									/>
								</CardFooter>
							</Link>
						</Card>
					))}
				</div>
			)}

			{selectedProjectForEdit && (
				<ProjectForm
					mode="edit"
					initialData={selectedProjectForEdit}
					isOpen={isEditDialogOpen}
					onOpenChange={handleDialogClose}
					onProjectUpdated={handleProjectUpdated}
				/>
			)}

			<DeleteProject
				open={isDeleteDialogOpen}
				onOpenChange={handleDialogCloseDelete}
				project={selectedProjectForDelete}
				onDeleteConfirm={(projectId) => deleteProject(projectId)}
			/>

			{selectedProjectForShare && (
				<ShareProject
					open={isShareProjectOpen}
					onOpenChange={handleDialogCloseShare}
					project={selectedProjectForShare}
				/>
			)}
		</>
	);
};

export default ProjectLists;
