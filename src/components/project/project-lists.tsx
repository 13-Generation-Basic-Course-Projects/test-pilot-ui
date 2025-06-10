// components/project-lists.tsx
"use client";
import React, { useState } from "react";
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
	FolderPlusIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProjectForm from "./project-form";
import { DeleteProject } from "../delete/delete-project";
import { ShareProject } from "../share/share-project";
import { SearchForm } from "../search-form";
import { deleteProjectAction } from "@/action/project-action";
import { Button } from "../ui/button";

const ProjectLists = ({ projects: initialProjects }: ProjectProps) => {
	const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);

	const [selectedProjectForEdit, setSelectedProjectForEdit] =
		useState<ProjectItem | null>(null);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	const [selectedProjectForDelete, setSelectProjectForDelete] =
		useState<ProjectItem | null>(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const [selectedProjectForShare, setSelectedProjectForShare] =
		useState<ProjectItem | null>(null);
	const [isShareProjectOpen, setIsShareProjectOpen] = useState(false);

	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	const [searchQuery, setSearchQuery] = useState("");

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
		try {
			await deleteProjectAction(projectId);
			setProjects((prev) => prev.filter((project) => project.id !== projectId));
			setIsDeleteDialogOpen(false);
			setSelectProjectForDelete(null);
		} catch (error) {
			console.error("Failed to delete project", error);
		}
	};

	//create project
	const handleDialogCloseCreate = (open: boolean) => {
		setIsCreateDialogOpen(open);
	};

	const handleProjectCreated = (newProject: ProjectItem) => {
		if (!newProject?.id || !newProject?.title) return;
		setProjects((prev) => [...prev, newProject]);
		setIsCreateDialogOpen(false);
	};

	//Update project
	const handleProjectUpdated = (updatedProject: ProjectItem) => {
		console.log("handleProjectUpdated called with:", updatedProject);
		setProjects((prev) =>
			prev.map((project) =>
				project.id === updatedProject.id ? updatedProject : project
			)
		);
	};

	//Search project
	const handleSearchChange = (query: string) => {
		setSearchQuery(query.toLowerCase());
	};

	const filteredProjects = projects.filter((project) =>
		project.title.toLowerCase().includes(searchQuery)
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
					<ProjectForm
						mode="create"
						isOpen={isCreateDialogOpen}
						onOpenChange={handleDialogCloseCreate}
						onProjectCreated={handleProjectCreated}
					/>
				</div>
				<SearchForm className="mt-10" onSearch={handleSearchChange} />
			</div>

			{filteredProjects.length === 0 ? (
				<div className="text-center text-slate-500 mt-10 justify-center">
					<p className="text-lg font-medium ">No projects found</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
					{projects.map((project) => (
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
													className="cursor-pointer"
												>
													<EditIcon className="mr-2 h-4 w-4" />
													<span>Edit</span>
												</DropdownMenuItem>
												<DropdownMenuItem
													onSelect={(e) => {
														e.preventDefault();
														handleDelete(project);
													}}
													className="cursor-pointer"
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
										src={"/profile.png"} // not yet to fetch
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
