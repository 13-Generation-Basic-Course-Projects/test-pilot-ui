"use client";
import { getMethodColor } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import {
	EditIcon,
	FileOutput,
	FilePlus2Icon,
	FilePlusIcon,
	Folder,
	FolderDownIcon,
	FolderOpenIcon,
	Share2Icon,
	TrashIcon,
} from "lucide-react";
import { projectsData } from "@/lib/constants";
import { Button } from "./ui/button";
import { CollectionItem, Endpoint } from "@/types";
import { ItemActionsDropdown } from "./dropdown-more-menu";
import Link from "next/link";
import { CollectionForm } from "./collection-form";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const CollectionSidebar = () => {
	const [openCollections, setOpenCollections] = useState<Record<
		string,
		boolean
	> | null>(null);

	useEffect(() => {
		const saved = localStorage.getItem("openCollections");
		setOpenCollections(saved ? JSON.parse(saved) : {});
	}, []);

	useEffect(() => {
		if (openCollections !== null) {
			localStorage.setItem("openCollections", JSON.stringify(openCollections));
		}
	}, [openCollections]);

	const toggleCollection = (collectionId: string) => {
		setOpenCollections((prev) => ({
			...prev,
			[collectionId]: !prev?.[collectionId],
		}));
	};

	if (openCollections === null) {
		return null;
	}

	const getCollectionMenuItems = (collection: CollectionItem) => [
		{
			icon: <FilePlusIcon className="w-4 h-4" />,
			label: "Add Request",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				console.log("Rename collection:", collection.id, collection.title);
				// Add your add request logic
			},
		},
		{ isSeparator: true as const },
		{
			icon: <Share2Icon className="w-4 h-4" />,
			label: "Share",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				console.log("Add request to collection:", collection.id);
				// Add your share logic
			},
		},
		{ isSeparator: true as const },
		{
			icon: <EditIcon className="w-4 h-4" />,
			label: "Rename",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				console.log("Delete collection:", collection.id);
				// Add your rename logic
			},
		},
		{
			icon: <FilePlus2Icon className="w-4 h-4" />,
			label: "Duplicate",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				console.log("Delete collection:", collection.id);
				// Add your duplicate logic
			},
		},
		{
			icon: <FileOutput className="w-4 h-4" />,
			label: "Export",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				console.log("Delete collection:", collection.id);
				// Add your export logic
			},
		},
		{
			icon: (
				<TrashIcon className="w-4 h-4 hover:!text-red-600 hover:!bg-red-50" />
			),
			label: "Delete",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				console.log("Delete collection:", collection.id);
				// Add your delete logic
			},
			className: "text-red-600 hover:!text-red-600 hover:!bg-red-50", // Example custom styling
		},
	];

	const getEndpointMenuItems = (endpoint: Endpoint) => [
		{
			icon: <Share2Icon className="w-4 h-4" />,
			label: "Share",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				console.log("Add request to collection:", endpoint.id);
				// Add your share logic
			},
		},
		{ isSeparator: true as const },
		{
			icon: <EditIcon className="w-4 h-4" />,
			label: "Rename",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				console.log("Delete collection:", endpoint.id);
				// Add your rename logic
			},
		},
		{
			icon: <FilePlus2Icon className="w-4 h-4" />,
			label: "Duplicate",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				console.log("Delete collection:", endpoint.id);
				// Add your duplicate logic
			},
		},
		{
			icon: <FileOutput className="w-4 h-4" />,
			label: "Export",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				console.log("Delete collection:", endpoint.id);
				// Add your export logic
			},
		},
		{
			icon: (
				<TrashIcon className="w-4 h-4 hover:!text-red-600 hover:!bg-red-50" />
			),
			label: "Delete",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				console.log("Delete collection:", endpoint.id);
				// Add your delete logic
			},
			className: "text-red-600 hover:!text-red-600 hover:!bg-red-50",
		},
	];

	return (
		<div>
			{/* Main Content Area */}
			<div className="flex h-screen items-start relative self-stretch w-fit">
				{/* Collections Panel */}
				<div className="flex flex-col w-[400px] items-start relative self-stretch border-r border-[#e2e2e2]">
					{/* Collections Header */}
					<div className="flex w-[400px] items-center justify-between px-[17px] py-5 relative flex-[0_0_auto] border-r border-b border-slate-200">
						<CollectionForm />
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="cursor-pointer">
									<FolderDownIcon className="relative w-6 h-6" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem>Import</DropdownMenuItem>
								<DropdownMenuItem>Export</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Projects and Collections */}
					<div className="w-full overflow-y-auto">
						{projectsData.map((project) => (
							<div key={project.id}>
								{/* Collections */}
								<div>
									{project.collections.map((collection) => (
										<div key={`${project.id}-${collection.id}`}>
											<div
												className="group flex items-center justify-between px-6 py-2 hover:bg-slate-50 cursor-pointer"
												onClick={(e) => {
													toggleCollection(collection.id);
													e.stopPropagation();
												}}
											>
												<div className="flex items-center gap-3 className py-2">
													{openCollections[collection.id] ? (
														<FolderOpenIcon className="w-5 h-5 text-slate-600" />
													) : (
														<Folder className="w-5 h-5 text-slate-600" />
													)}
													<span className="text-[15px] font-medium">
														{collection.title}
													</span>
												</div>
												<ItemActionsDropdown
													items={getCollectionMenuItems(collection)}
												/>
											</div>
											{/* Endpoints */}
											{openCollections[collection.id] && (
												<div className="pl-10 pr-4 py-1 space-y-1 ">
													{collection.endpoints.map((endpoint) => (
														<Link
															key={`${collection.id}-${endpoint.id}`}
															onMouseDown={(e) => e.stopPropagation()}
															href={`/project/${collection.id}/request/${endpoint.id}`}
															className="group relative flex items-center justify-between gap-2  hover:bg-slate-100 cursor-pointer rounded-lg p-1 pr-2"
														>
															<div className="flex items-center gap-2 flex-grow">
																<Badge
																	variant="outline"
																	className="h-5 px-4 py-3 text-[15px] font-medium"
																>
																	<span
																		className={getMethodColor(endpoint.method)}
																	>
																		{endpoint.method}
																	</span>
																</Badge>
																<span className="text-[15px] text-slate-600 ">
																	{endpoint.path}
																</span>
															</div>
															<ItemActionsDropdown
																items={getEndpointMenuItems(endpoint)}
															/>
														</Link>
													))}
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
