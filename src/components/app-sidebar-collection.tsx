"use client";

import type React from "react";
import { useEffect, useState } from "react";
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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { projectsData } from "@/lib/constants";
import { getMethodColor } from "@/lib/utils";
import { CollectionItem, Endpoint } from "@/types";
import { CollectionForm } from "./collection/collection-form";
import { ItemActionsDropdown } from "./dropdown-more-menu";
import { ExportEndpoint } from "./export/export-endpoint";
import { ExportCollection } from "./export/export-collection";
import { ShareCollection } from "./share/share-collection";
import { ShareEndpoint } from "./share/share-endpoint";
import { ImportCollection } from "./import/import-collection";
import { DeleteCollection } from "./delete/delete-collection";
import { DeleteEndpoint } from "./delete/delete-endpoint";

export const CollectionSidebar = () => {
	const [isCollectionSidebarOpen, setIsCollectionSidebarOpen] = useState(true);
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
	// Rename
	const [renamingEndpointId, setRenamingEndpointId] = useState<string | null>(
		null
	);
	// Export request
	const [isExportRequestOpen, setIsExportRequestOpen] = useState(false);
	const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(
		null
	);

	// Export collection
	const [isExportCollectionOpen, setIsExportCollectionOpen] = useState(false);
	const [selectedCollection, setSelectedCollection] =
		useState<CollectionItem | null>(null);

	// Import collection
	const [isImportCollectionOpen, setIsImportCollectionOpen] = useState(false);

	const [isShareCollectionOpen, setIsShareCollectionOpen] = useState(false);
	const [isShareEndpointOpen, setIsShareEndpointOpen] = useState(false);

	// Delete request
	const [endpointToDelete, setEndpointToDelete] = useState<{
		projectId: string;
		collectionId: string;
		endpointId: string;
	} | null>(null);

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

	const handleAddEndpoint = (projectId: string, collectionId: string) => {
		const newEndpoint: Endpoint = {
			id: `endpoint-${Date.now()}`,
			method: "GET",
			path: "/new-request",
		};

		setCollectionsData((prev) =>
			prev.map((project) => {
				if (project.id !== projectId) return project;
				return {
					...project,
					collections: project.collections.map((collection) =>
						collection.id === collectionId
							? {
									...collection,
									endpoints: [...collection.endpoints, newEndpoint],
							  }
							: collection
					),
				};
			})
		);

		// Automatically start renaming the new endpoint
		// setRenamingEndpointId(newEndpoint.id);
	};

	const handleCreateCollection = (title: string) => {
		const newCollection: CollectionItem = {
			id: `collection-${Date.now()}`,
			title,
			endpoints: [],
		};

		setCollectionsData((prev) => {
			return prev.map((project, index) => {
				if (index === 0) {
					return {
						...project,
						collections: [...project.collections, newCollection],
					};
				}
				return project;
			});
		});
	};
	const handleRename = (
		projectId: string,
		collectionId: string,
		newTitle: string
	) => {
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

	const handleDuplicateCollection = (
		projectId: string,
		collectionId: string
	) => {
		setCollectionsData((prev) =>
			prev.map((project) => {
				if (project.id !== projectId) return project;

				const collectionToDuplicate = project.collections.find(
					(collection) => collection.id === collectionId
				);

				if (!collectionToDuplicate) return project;

				const duplicatedCollection = {
					...collectionToDuplicate,
					id: `${collectionId}-copy-${Date.now()}`,
				};

				return {
					...project,
					collections: [...project.collections, duplicatedCollection],
				};
			})
		);
	};

	const handleDuplicateEndpoint = (
		projectId: string,
		collectionId: string,
		endpointId: string
	) => {
		setCollectionsData((prev) =>
			prev.map((project) => {
				if (project.id !== projectId) return project;
				return {
					...project,
					collections: project.collections.map((collection) => {
						if (collection.id !== collectionId) return collection;

						const endpointToDuplicate = collection.endpoints.find(
							(endpoint) => endpoint.id === endpointId
						);

						if (!endpointToDuplicate) return collection;

						const duplicatedEndpoint = {
							...endpointToDuplicate,
							id: `${endpointToDuplicate.id}-copy-${Date.now()}`,
						};

						return {
							...collection,
							endpoints: [...collection.endpoints, duplicatedEndpoint],
						};
					}),
				};
			})
		);
	};

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

	const getCollectionMenuItems = (
		collection: CollectionItem,
		projectId: string
	) => [
		{
			icon: <FilePlusIcon className="w-4 h-4" />,
			label: "Add Request",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				console.log("Add request:", collection.id);
				console.log(projectId);
				handleAddEndpoint(projectId, collection.id);
			},
		},
		{ isSeparator: true as const },
		{
			icon: <Share2Icon className="w-4 h-4" />,
			label: "Share",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				setSelectedCollection(collection);
				setIsShareCollectionOpen(true);
			},
			className: "cursor-pointer",
		},
		{ isSeparator: true as const },
		{
			icon: <EditIcon className="w-4 h-4" />,
			label: "Rename",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				setRenamingCollectionId(collection.id);
			},
			className: "cursor-pointer",
		},
		{
			icon: <FilePlus2Icon className="w-4 h-4" />,
			label: "Duplicate",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				handleDuplicateCollection(projectId, collection.id);
			},
		},
		{
			icon: <FileOutput className="w-4 h-4" />,
			label: "Export",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				setSelectedCollection(collection);
				setIsExportCollectionOpen(true);
				console.log("Export collection:", collection.id);
			},
			className: "cursor-pointer",
		},
		{
			icon: (
				<TrashIcon className="w-4 h-4 hover:!text-red-600 hover:!bg-red-50" />
			),
			label: "Delete",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				setTimeout(
					() =>
						setCollectionToDelete({ projectId, collectionId: collection.id }),
					0
				);
			},
			className:
				"text-red-600 hover:!text-red-600 hover:!bg-red-50 cursor-pointer",
		},
	];

	const getEndpointMenuItems = (
		endpoint: Endpoint,
		collectionId: string,
		projectId: string
	) => [
		{
			icon: <Share2Icon className="w-4 h-4" />,
			label: "Share",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				setSelectedEndpoint(endpoint);
				setIsShareEndpointOpen(true);
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
			className: "cursor-pointer",
		},
		{
			icon: <FilePlus2Icon className="w-4 h-4" />,
			label: "Duplicate",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				e.preventDefault();
				handleDuplicateEndpoint(projectId, collectionId, endpoint.id);
			},
			className: "cursor-pointer",
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
			className: "cursor-pointer",
		},
		{
			icon: (
				<TrashIcon className="w-4 h-4 hover:!text-red-600 hover:!bg-red-50" />
			),
			label: "Delete",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				setTimeout(
					() =>
						setEndpointToDelete({
							projectId,
							collectionId,
							endpointId: endpoint.id,
						}),
					0
				);
			},
			className:
				"text-red-600 hover:!text-red-600 hover:!bg-red-50 cursor-pointer",
		},
	];

	if (openCollections === null) return null;

	if (!isCollectionSidebarOpen) {
		return (
			<div className="border-r bg-background h-full p-2 duration-75">
				<Button
					variant="outline"
					size="sm"
					onClick={() => setIsCollectionSidebarOpen(true)}
					className="w-full"
				>
					<Folder className="w-4 h-4" />
				</Button>
			</div>
		);
	}

	return (
		<>
			<div className="w-80 border-r bg-background duration-300">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b">
					<CollectionForm onCollectionCreate={handleCreateCollection} />
					{/* In the header section, add a close button after the dropdown menu: */}
					<div className="flex items-center gap-1">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="h-8 w-8">
									<FolderDownIcon className="w-4 h-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem
									onClick={() => setIsImportCollectionOpen(true)}
									className="cursor-pointer"
								>
									Import
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => setIsExportCollectionOpen(true)}
									className="cursor-pointer"
								>
									Export
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8"
							onClick={() => setIsCollectionSidebarOpen(false)}
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</Button>
					</div>
				</div>

				{/* Collections */}
				<div className="flex-1 overflow-auto">
					{collectionsData.map((project) =>
						project.collections.map((collection) => (
							<div key={`${project.id}-${collection.id}`}>
								<div
									className="group flex items-center justify-between px-4 py-3 mb-2 hover:bg-muted/50 cursor-pointer"
									onClick={(e) => {
										toggleCollection(collection.id);
										e.stopPropagation();
									}}
								>
									<div className="flex items-center gap-3">
										{openCollections[collection.id] ? (
											<FolderOpenIcon className="w-4 h-4 text-muted-foreground" />
										) : (
											<Folder className="w-4 h-4 text-muted-foreground" />
										)}
										{renamingCollectionId === collection.id ? (
											<Input
												autoFocus
												defaultValue={collection.title}
												onClick={(e) => e.stopPropagation()}
												onBlur={(e) => {
													handleRename(
														project.id,
														collection.id,
														e.target.value
													);
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
												className="h-6"
											/>
										) : (
											<span className="font-medium">{collection.title}</span>
										)}
									</div>
									<ItemActionsDropdown
										items={getCollectionMenuItems(collection, project.id)}
									/>
								</div>

								{openCollections[collection.id] && (
									<div className="pb-2">
										{collection.endpoints.map((endpoint) => {
											const endpointPath = `/project/${collection.id}/request/${endpoint.id}`;
											const isActive = pathname === endpointPath;
											return (
												<div
													key={`${collection.id}-${endpoint.id}`}
													className={`group mx-4 mb-1 rounded-md ${
														isActive ? "bg-muted" : "hover:bg-muted/50"
													}`}
												>
													<Link
														href={endpointPath}
														className="flex items-center justify-between gap-2 p-2"
														onMouseDown={(e) => e.stopPropagation()}
													>
														<div className="flex items-center gap-2 flex-grow min-w-0">
															<Badge
																variant="outline"
																className="h-5 px-2 text-xs font-medium shrink-0"
															>
																<span
																	className={getMethodColor(endpoint.method)}
																>
																	{endpoint.method}
																</span>
															</Badge>
															{renamingEndpointId === endpoint.id ? (
																<Input
																	autoFocus
																	defaultValue={endpoint.path}
																	onClick={(e) => {
																		e.preventDefault();
																		e.stopPropagation();
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
																<span className="text-sm text-muted-foreground truncate">
																	{endpoint.path}
																</span>
															)}
														</div>
														<ItemActionsDropdown
															items={getEndpointMenuItems(
																endpoint,
																collection.id,
																project.id
															)}
														/>
													</Link>
												</div>
											);
										})}
									</div>
								)}
							</div>
						))
					)}
				</div>
			</div>

			{/* All your existing dialogs */}
			<ExportEndpoint
				open={isExportRequestOpen}
				onOpenChange={setIsExportRequestOpen}
			/>
			<ExportCollection
				open={isExportCollectionOpen}
				onOpenChange={setIsExportCollectionOpen}
			/>
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
			<ImportCollection
				open={isImportCollectionOpen}
				onOpenChange={setIsImportCollectionOpen}
			/>

			{collectionToDelete && (
				<DeleteCollection
					open={!!collectionToDelete}
					onOpenChange={(open) => {
						if (!open) setCollectionToDelete(null);
					}}
					onConfirm={() => {
						const { projectId, collectionId } = collectionToDelete;

						setCollectionsData((prev) =>
							prev.map((project) =>
								project.id === projectId
									? {
											...project,
											collections: project.collections.filter(
												(collection) => collection.id !== collectionId
											),
									  }
									: project
							)
						);
						setOpenCollections((prev) => {
							if (!prev) return prev;
							const updated = { ...prev };
							delete updated[collectionId];
							return updated;
						});

						setCollectionToDelete(null);
					}}
				/>
			)}

			{endpointToDelete && (
				<DeleteEndpoint
					open={!!endpointToDelete}
					onOpenChange={(open) => {
						if (!open) setEndpointToDelete(null);
					}}
					onConfirm={() => {
						const { projectId, collectionId, endpointId } = endpointToDelete;

						setCollectionsData((prev) =>
							prev.map((project) =>
								project.id === projectId
									? {
											...project,
											collections: project.collections.map((collection) =>
												collection.id === collectionId
													? {
															...collection,
															endpoints: collection.endpoints.filter(
																(endpoint) => endpoint.id !== endpointId
															),
													  }
													: collection
											),
									  }
									: project
							)
						);

						setEndpointToDelete(null);
					}}
				/>
			)}
		</>
	);
};
