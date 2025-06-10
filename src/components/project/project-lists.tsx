"use client";
import React, { useEffect, useState } from "react";
import { ProjectItem } from "@/types";
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
import { DeleteProject } from "../history/delete/delete-project";
import { ShareProject } from "../share/share-project";
import { SearchForm } from "../search-form";
import { projectsData } from "@/lib/constants";

const ProjectLists = ({ searchQuery = "" }) => {
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

	useEffect(() => {
		try {
			const masterListJSON = localStorage.getItem("projects");

			if (!masterListJSON || masterListJSON === "[]") {
				console.log("Local storage is empty. Seeding with initial data...");

				// --- NEW SEEDING LOGIC ---
				// 1. Prepare the master list with a calculated default URL
				const masterListForStorage = projectsData.map((p) => {
					let defaultRequestUrl = `/project/${p.id}`; // Fallback URL

					if (p.collections && p.collections.length > 0) {
						const firstCollection = p.collections[0];
						if (
							firstCollection.endpoints &&
							firstCollection.endpoints.length > 0
						) {
							const firstEndpoint = firstCollection.endpoints[0];
							defaultRequestUrl = `/project/${p.id}/collection/${firstCollection.id}/request/${firstEndpoint.id}`;
						}
					}

					return {
						id: p.id,
						title: p.title as string,
						description: p.description as string,
						creationDate: p.creationDate as string,
						userAvatarUrl: p.userAvatarUrl as string,
						defaultRequestUrl: defaultRequestUrl, // Add the new property
					};
				});
				localStorage.setItem("projects", JSON.stringify(masterListForStorage));

				// 2. Create a separate, detailed entry for EACH project
				projectsData.forEach((project) => {
					const projectKey = `project-data-${project.id}`;
					localStorage.setItem(projectKey, JSON.stringify(project));
				});

				// 3. Set the component's state to display the seeded projects
				setProjects(masterListForStorage);
				// --- END OF SEEDING LOGIC ---
			} else {
				const storedProjects: ProjectItem[] = JSON.parse(masterListJSON);
				setProjects(storedProjects);
			}
		} catch (error) {
			console.error(
				"Failed to load or seed projects from local storage:",
				error
			);
			setProjects([]);
		}
	}, []);

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
	};

	const handleProjectCreated = (newProject: ProjectItem) => {
		// Here, you would ideally calculate the defaultRequestUrl for the new project as well
		// For simplicity, we'll just add it without it for now.
		const updatedProjects = [...projects, newProject];
		updateProjectsAndStorage(updatedProjects);
	};

	const handleProjectUpdated = (updatedProject: ProjectItem) => {
		const updatedProjects = projects.map((project) =>
			project.id === updatedProject.id ? updatedProject : project
		);
		updateProjectsAndStorage(updatedProjects);
	};

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

			{filteredProjects.length === 0 ? (
				<div className="text-center text-slate-500 mt-10 justify-center">
					<p className="text-lg font-medium ">No projects found</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
					{filteredProjects.map((project) => (
						<Card key={project.id}>
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
							{/* UPDATED LINK: Points to the default request URL with a fallback */}
							<Link
								href={project.defaultRequestUrl || `/project/${project.id}`}
							>
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
