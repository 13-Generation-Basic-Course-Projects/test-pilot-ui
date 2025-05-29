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
	Trash2Icon,
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
import { Input } from "./ui/input";
import { usePathname } from "next/navigation";
import { ImportColletion } from "./import-collection";
import { DeleteCollection } from "./delete-collection";
import { ExportEndpoint } from "./export-endpoint";
import { ExportCollection } from "./export-collection";
import { ShareCollection } from "./share-collection";
import { ShareEndpoint } from "./share-endpoint";

export const CollectionSidebar = () => {
	const [isImportOpen, setIsImportOpen] = useState(false);
	const [isExportOpen, setIsExportOpen] = useState(false);
	const [openCollections, setOpenCollections] = useState<Record<
		string,
		boolean
	> | null>(null);
	const [renamingCollectionId, setRenamingCollectionId] = useState<
		string | null
	>(null);
	const [collectionsData, setCollectionsData] = useState(projectsData);
	const [collectionToDelete, setCollectionToDelete] = useState<{
		projectId: string;
		collectionId: string;
	} | null>(null);


	//Rename
	const [renamingEndpointId, setRenamingEndpointId] = useState<string | null>(null);

	//Export request
	const [isExportRequestOpen, setIsExportRequestOpen] = useState(false);
	const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);

	//Export collection
	const [isExportCollectionOpen, setIsExportCollectionOpen] = useState(false);
	const [selectedCollection, setSelectedCollection] = useState<CollectionItem | null>(null);

	//Sahre Collection
	const [isShareCollectionOpen, setIsShareCollectionOpen] = useState(false);

	//Sahre Endpoint
	const [isShareEndpointOpen, setIsShareEndpointOpen] = useState(false);



	useEffect(() => {
		const saved = localStorage.getItem("openCollections");
		setOpenCollections(saved ? JSON.parse(saved) : {});
	}, []);

	useEffect(() => {
		if (openCollections !== null) {
			localStorage.setItem("openCollections", JSON.stringify(openCollections));
		}
	}, [openCollections]);

	const pathname = usePathname();

	const toggleCollection = (collectionId: string) => {
		setOpenCollections((prev) => ({
			...prev,
			[collectionId]: !prev?.[collectionId],
		}));
	};

	const handleRename = (projectId: string, collectionId: string, newTitle: string) => {
		setCollectionsData((prev) =>
			prev.map((project) => {
				if (project.id !== projectId) return project;
				return {
					...project,
					collections: project.collections.map((collection) =>
						collection.id === collectionId
							? { ...collection, title: newTitle }
							: collection
					),
				};
			})
		);
	};


	//Rename endpoint
	const handleRenameEndpoint = (
		projectId: string,
		collectionId: string,
		endpointId: string,
		newTitle: string
	) => {
		setCollectionsData((prev) =>
			prev.map((project) => {
				if (project.id !== projectId) return project;
				return {
					...project,
					collections: project.collections.map((collection) => {
						if (collection.id !== collectionId) return collection;
						return {
							...collection,
							endpoints: collection.endpoints.map((endpoint) =>
								endpoint.id === endpointId
									? { ...endpoint, path: newTitle }
									: endpoint
							),
						};
					}),
				};
			})
		);
	};

	const getCollectionMenuItems = (collection: CollectionItem, projectId: string) => [
		{
			icon: <FilePlusIcon className="w-4 h-4" />,
			label: "Add Request",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				console.log("Add request:", collection.id);
				console.log(projectId);
			},
		},
		{ isSeparator: true as const },
		{
			icon: <Share2Icon className="w-4 h-4" />,
			label: "Share",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				console.log("Share collection:", collection.id);
			},
		},
		{ isSeparator: true as const },
		{
			icon: <EditIcon className="w-4 h-4" />,
			label: "Rename",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				setRenamingCollectionId(collection.id);
			},
		},
		{
			icon: <FilePlus2Icon className="w-4 h-4" />,
			label: "Duplicate",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				console.log("Duplicate collection:", collection.id);
			},
		},
		{
			icon: <FileOutput className="w-4 h-4" />,
			label: "Export",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				setSelectedCollection(collection);
				setIsExportCollectionOpen(true)
				console.log("Export collection:", collection.id);
			},
			className: "cursor-pointer"
		},
		{
			icon: <TrashIcon className="w-4 h-4 hover:!text-red-600 hover:!bg-red-50" />,
			label: "Delete",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				setTimeout(() => setCollectionToDelete({ projectId, collectionId: collection.id }), 0);
			},
			className: "text-red-600 hover:!text-red-600 hover:!bg-red-50 cursor-pointer",
		},
	];

	const getEndpointMenuItems = (endpoint: Endpoint) => [
		{
			icon: <Share2Icon className="w-4 h-4" />,
			label: "Share",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				setSelectedEndpoint(endpoint);
				setIsShareEndpointOpen(true)
				console.log(selectedEndpoint);
			},
			className: "cursor-pointer",
		},
		{ isSeparator: true as const },
		{
			icon: <EditIcon className="w-4 h-4" />,
			label: "Rename",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				setRenamingEndpointId(endpoint.id);
			},
			className: "cursor-pointer"
		},
		{
			icon: <FilePlus2Icon className="w-4 h-4" />,
			label: "Duplicate",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				console.log("Duplicate endpoint:", endpoint.id);
			},
		},
		{
			icon: <FileOutput className="w-4 h-4" />,
			label: "Export",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				setSelectedEndpoint(endpoint);
				setIsExportRequestOpen(true);
				console.log(selectedEndpoint);
			},
			className: "cursor-pointer"
		},
		{
			icon: <TrashIcon className="w-4 h-4 hover:!text-red-600 hover:!bg-red-50" />,
			label: "Delete",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				console.log("Delete endpoint:", endpoint.id);
			},
			className: "text-red-600 hover:!text-red-600 hover:!bg-red-50",
		},
	];

	if (openCollections === null) return null;

	return (
		<div className="flex items-start relative self-stretch h-screen">
			<div className="flex flex-col w-[400px] items-start relative self-stretch border-r border-[#e2e2e2]">
				<div className="flex w-[400px] items-center justify-between px-[17px] py-5 relative flex-[0_0_auto] border-r border-b border-slate-200">
					<CollectionForm />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="cursor-pointer">
								<FolderDownIcon className="relative w-6 h-6" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem onClick={() => setIsImportOpen(true)} className="cursor-pointer">Import</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setIsExportOpen(true)} className="cursor-pointer">Export</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="w-full h-screen overflow-hidden pb-3">
					<div
						className="w-full h-full overflow-y-scroll"
						style={{
							scrollbarWidth: "none",
							msOverflowStyle: "none",
						}}
					>
						{collectionsData.map((project) => (
							<div key={project.id}>
								{project.collections.map((collection) => (
									<div key={`${project.id}-${collection.id}`}>
										<div
											className="group flex items-center justify-between px-6 py-2 hover:bg-slate-50 cursor-pointer"
											onClick={(e) => {
												toggleCollection(collection.id);
												e.stopPropagation();
											}}
										>
											<div className="flex items-center gap-3 py-2">
												{openCollections[collection.id] ? (
													<FolderOpenIcon className="w-5 h-5 text-slate-600" />
												) : (
													<Folder className="w-5 h-5 text-slate-600" />
												)}
												{renamingCollectionId === collection.id ? (
													<Input
														autoFocus
														defaultValue={collection.title}
														onClick={(e) => e.stopPropagation()}
														onBlur={(e) => {
															handleRename(project.id, collection.id, e.target.value);
															setRenamingCollectionId(null);
															e.stopPropagation();
														}}
														onKeyDown={(e) => {
															if (e.key === "Enter") {
																(e.target as HTMLInputElement).blur();
															}
															if (e.key === "Escape") {
																setRenamingCollectionId(null);
															}
															e.stopPropagation();
														}}
													/>
												) : (
													<span className="text-[15px] font-medium">{collection.title}</span>
												)}
											</div>
											<ItemActionsDropdown
												items={getCollectionMenuItems(collection, project.id)}
											/>
										</div>

										{openCollections[collection.id] && (
											<div className="pl-10 pr-4 py-1 space-y-1">
												{collection.endpoints.map((endpoint) => {
													const endpointPath = `/project/${collection.id}/request/${endpoint.id}`;
													const isActive = pathname === endpointPath;
													return (
														<Link
															key={`${collection.id}-${endpoint.id}`}
															onMouseDown={(e) => e.stopPropagation()}
															href={endpointPath}
															onClick={(e) => e.stopPropagation()}
															className={`group relative flex items-center justify-between gap-2 rounded-lg p-1 pr-2 cursor-pointer ${isActive
																? "bg-slate-100 hover:bg-slate-200"
																: "hover:bg-slate-100"
																}`}
														>
															<div className="flex items-center gap-2 flex-grow">
																<Badge
																	variant="outline"
																	className="h-5 px-4 py-3 text-[15px] font-medium"
																>
																	<span className={getMethodColor(endpoint.method)}>
																		{endpoint.method}
																	</span>
																</Badge>
																{renamingEndpointId === endpoint.id ? (
																	<Input
																		autoFocus
																		defaultValue={endpoint.path}
																		onClick={(e) => {
																			e.preventDefault()
																			e.stopPropagation()
																		}}
																		onMouseDown={(e) => e.stopPropagation()}
																		onBlur={(e) => {
																			handleRenameEndpoint(
																				project.id,
																				collection.id,
																				endpoint.id,
																				e.target.value
																			);
																			setRenamingEndpointId(null);
																			e.stopPropagation();
																		}}
																		onKeyDown={(e) => {
																			if (e.key === "Enter") {
																				(e.target as HTMLInputElement).blur();
																			}
																			if (e.key === "Escape") {
																				setRenamingEndpointId(null);
																			}
																			e.stopPropagation();
																		}}
																		className="h-6"
																	/>
																) : (
																	<span className="text-[15px] text-slate-600">{endpoint.path}</span>
																)}
															</div>
															<ItemActionsDropdown items={getEndpointMenuItems(endpoint)} />
														</Link>
													);
												})}
											</div>
										)}
									</div>
								))}
							</div>
						))}
					</div>
					<ExportEndpoint
						open={isExportRequestOpen}
						onOpenChange={setIsExportRequestOpen}
					/>
					<ExportCollection
						open={isExportCollectionOpen}
						onOpenChange={setIsExportCollectionOpen} />
					<ShareCollection
						open={isShareCollectionOpen}
						onOpenChange={setIsShareCollectionOpen}
						collection={selectedCollection}
					/>
					<ShareEndpoint
						open={isShareEndpointOpen}
						onOpenChange={setIsShareEndpointOpen}
						endpoint={selectedEndpoint}  
					/>
				</div>
			</div>
		</div>
	);
};
