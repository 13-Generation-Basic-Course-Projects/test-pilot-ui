"use client";
import React from "react";
import { projectsProps } from "@/types/projectType";
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
	EditIcon,
	Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ProjectLists = ({ projects }: projectsProps) => {
	return (
		<div className="grid grid-cols-3 gap-10">
			{projects.map((project) => {
				return (
					<Link href={`project/${project.id}`} key={project.id}>
						<Card className="">
							<CardHeader>
								<div className="flex justify-between items-start">
									<Image
										src="/folderIcon.png"
										alt="folder-icons"
										width={50}
										height={50}
									/>
									<div>
										<DropdownMenu>
											<DropdownMenuTrigger>
												<MoreHorizontal className="hover:bg-slate-400/10 rounded-md cursor-pointer" />
											</DropdownMenuTrigger>
											<DropdownMenuContent>
												<DropdownMenuItem>
													<ShareIcon />
													Share
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem>
													<EditIcon /> Edit
												</DropdownMenuItem>
												<DropdownMenuItem variant="destructive">
													<Trash2Icon />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>
								<CardTitle className="mt-4">
									<h1 className="text-lg">{project.title}</h1>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-clip line-clamp-2">{project.description}</p>
							</CardContent>
							<CardFooter className="flex justify-between items-center">
								<div className="flex items-center gap-2">
									<CalendarPlus className="text-slate-400 size-4" />
									<p className="text-sm text-slate-400">
										{project.creationDate}
									</p>
								</div>
								<Image
									src={project.userAvatarUrl}
									alt="userProfile"
									width={35}
									height={35}
									className="rounded-full"
								/>
							</CardFooter>
						</Card>
					</Link>
				);
			})}
		</div>
	);
};

export default ProjectLists;
