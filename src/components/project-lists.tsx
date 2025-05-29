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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProjectForm from "./project-form";

const ProjectLists = ({ projects }: ProjectProps) => {
	const [selectedProjectForEdit, setSelectedProjectForEdit] =
		useState<ProjectItem | null>(null);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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

	return (
		<>
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
											<DropdownMenuItem>
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
											<DropdownMenuItem>
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

			{selectedProjectForEdit && (
				<ProjectForm
					mode="edit"
					initialData={selectedProjectForEdit}
					isOpen={isEditDialogOpen}
					onOpenChange={handleDialogClose}
				/>
			)}
		</>
	);
};

export default ProjectLists;
