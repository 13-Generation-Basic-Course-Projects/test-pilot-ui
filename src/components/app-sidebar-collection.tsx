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
import { CollectionForm } from "./collection/collection-form";
import { ItemActionsDropdown } from "./dropdown-more-menu";
import { ExportEndpoint } from "./export/export-endpoint";
import { ExportCollection } from "./export/export-collection";
import { ShareCollection } from "./share/share-collection";
import { ShareEndpoint } from "./share/share-endpoint";
import { ImportCollection } from "./import/import-collection";
import { DeleteCollection } from "./delete/delete-collection";
import { DeleteEndpoint } from "./delete/delete-endpoint";
import { fetchCollectionsForProject } from "@/action/collection-action";
import {
	fetchRequestForCollection,
	deleteRequestAction,
	updateRequestByIdAction,
	createRequestByCollectionIdAction,
} from "@/action/request-action";
import { CollectionItem, Endpoint } from "@/types";
import { toast } from "sonner";
import { getMethodColor } from "@/lib/utils";
import { createCollectionAction } from "@/action/collection-action";
import { deleteCollectionAction } from "@/action/collection-action";
import { CollectionSidebarSkeleton } from "./collection-sidebar-skeleton";

interface Project {
	id: string;
	collections: CollectionItem[];
}

export const CollectionSidebar = ({ projectId }: { projectId: string }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [isCollectionSidebarOpen, setIsCollectionSidebarOpen] = useState(true);
	const [openCollections, setOpenCollections] = useState<Record<
		string,
		boolean
	> | null>(null);
	const [renamingCollectionId, setRenamingCollectionId] = useState<
		string | null
	>(null);
	const [collectionsData, setCollectionsData] = useState<Project[]>([]);
	const [renamingEndpointId, setRenamingEndpointId] = useState<string | null>(
		null
	);
	const [isExportRequestOpen, setIsExportRequestOpen] = useState(false);
	const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(
		null
	);
	const [isExportCollectionOpen, setIsExportCollectionOpen] = useState(false);
	const [selectedCollection, setSelectedCollection] =
		useState<CollectionItem | null>(null);
	const [isImportCollectionOpen, setIsImportCollectionOpen] = useState(false);
	const [isShareCollectionOpen, setIsShareCollectionOpen] = useState(false);
	const [isShareEndpointOpen, setIsShareEndpointOpen] = useState(false);
	const [endpointToDelete, setEndpointToDelete] = useState<{
		projectId: string;
		collectionId: string;
		endpointId: string;
	} | null>(null);
	const [collectionToDelete, setCollectionToDelete] = useState<{
		projectId: string;
		collectionId: string;
	} | null>(null);

	useEffect(() => {
		const fetchCollections = async () => {
			setIsLoading(true); // Set loading to true when starting
			try {
				const collections = await fetchCollectionsForProject(projectId);
				setCollectionsData([
					{
						id: projectId,
						collections: collections.map((col) => ({
							...col,
							endpoints: [], // Initialize with empty endpoints
						})),
					},
				]);
			} catch (error) {
				console.error("Failed to fetch collections:", error);
				toast.error("Could not load collections.");
			} finally {
				setIsLoading(false); // Set loading to false when finished
			}
		};
		fetchCollections();
	}, [projectId]);

	// Fetch requests (endpoints) for each collection
	useEffect(() => {
		const fetchRequests = async () => {
			if (!collectionsData.length) return;

			const getProjects = await Promise.all(
				collectionsData.map(async (project) => {
					const getCollections = await Promise.all(
						project.collections.map(async (collection) => {
							const endpoints = await fetchRequestForCollection(collection.id);
							return {
								...collection,
								endpoints: endpoints.map((endpoint) => ({
									id: endpoint.id,
									method: endpoint.method || "GET",
									path: endpoint.name || endpoint.path || "/new-request",
									name: endpoint.name || endpoint.path || "/new-request",
								})),
							};
						})
					);
					return {
						...project,
						collections: getCollections,
					};
				})
			);

			setCollectionsData(getProjects);
		};

		fetchRequests();
	}, [collectionsData.length]);

	//Add endpoint
	const handleAddEndpoint = async (projectId: string, collectionId: string) => {
		try {
			const requestName = "New Request";
			const details = {
				url: "",
				pathVariables: {},
				queryParams: {},
				headers: {},
				body: null,
				description: "",
			};

			if (!requestName.trim()) {
				throw new Error("Request name cannot be blank");
			}

			const newEndpoint = await createRequestByCollectionIdAction({
				collectionId,
				requestName,
				method: "GET",
				details,
			});

			if (!newEndpoint) {
				throw new Error("Failed to create endpoint");
			}

			setCollectionsData((prev) =>
				prev.map((project) => {
					if (project.id !== projectId) return project;
					return {
						...project,
						collections: project.collections.map((collection) =>
							collection.id === collectionId
								? {
										...collection,
										endpoints: [
											...collection.endpoints,
											{
												id: newEndpoint.id,
												method: "GET",
												path: newEndpoint.name || requestName,
												name: newEndpoint.name || requestName,
											},
										],
								  }
								: collection
						),
					};
				})
			);

			toast.success("Endpoint created successfully");
		} catch (error: any) {
			console.error("Failed to add endpoint:", error);
			toast.error(
				`Failed to add endpoint: ${error.message || "Unknown error"}`
			);
		}
	};

	// Load openCollections from localStorage
	useEffect(() => {
		const saved = localStorage.getItem("openCollections");
		setOpenCollections(saved ? JSON.parse(saved) : {});
	}, []);

	// Save openCollections to localStorage
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

	const handleCreateCollection = async (title: string) => {
		const newCollection: CollectionItem = {
			id: `collection-${Date.now()}`,
			title,
			endpoints: [],
		};

		const projectId = pathname.split("/")[2];

		setCollectionsData((prev) => {
			const lastProjectIndex = prev.length - 1;
			return prev.map((project, index) => {
				if (index === lastProjectIndex) {
					return {
						...project,
						collections: [...project.collections, newCollection],
					};
				}
				return project;
			});
		});
		await createCollectionAction(title, projectId);
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

	const handleRenameEndpoint = async (
		projectId: string,
		collectionId: string,
		endpointId: string,
		newTitle: string
	) => {
		try {
			console.log("Renaming endpoint:", { endpointId, newTitle });
			await updateRequestByIdAction(collectionId, endpointId, {
				name: newTitle,
			});
			setCollectionsData((prev) =>
				prev.map((project) =>
					project.id === projectId
						? {
								...project,
								collections: project.collections.map((collection) =>
									collection.id === collectionId
										? {
												...collection,
												endpoints: collection.endpoints.map((endpoint) =>
													endpoint.id === endpointId
														? { ...endpoint, path: newTitle, name: newTitle }
														: endpoint
												),
										  }
										: collection
								),
						  }
						: project
				)
			);
			toast.success("Endpoint renamed successfully");
		} catch (error: any) {
			console.error("Failed to rename endpoint:", error);
			toast.error(
				`Failed to rename endpoint: ${error.message || "Unknown error"}`
			);
		}
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
				handleAddEndpoint(projectId, collection.id);
			},
			className: "cursor-pointer",
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
			},
			className: "cursor-pointer",
		},
		{
			icon: (
				<TrashIcon className="w-4 h-4 hover:!text-red-600 hover:!bg-red-50" />
			),
			label: "Delete",
			onClick: async (e: React.MouseEvent) => {
				e.stopPropagation();
				setTimeout(
					() =>
						setCollectionToDelete({ projectId, collectionId: collection.id }),

					0
				);
				await deleteCollectionAction(collection.id);
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
				// handleDuplicateEndpoint(projectId, collectionId, endpoint.id);
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

	if (openCollections === null) return <CollectionSidebarSkeleton />;

	if (isLoading) {
		return <CollectionSidebarSkeleton />;
	}

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
			<div className="w-80 border-r bg-background duration-75">
				{/* Header */}
				{!isLoading && collectionsData[0]?.collections.length === 0 && (
					<div className="p-4 text-center text-sm text-muted-foreground">
						No collections yet. <br /> Create one to get started!
					</div>
				)}
				<div className="flex items-center justify-between p-4 border-b">
					<CollectionForm onCollectionCreate={handleCreateCollection} />
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
				<div className="flex-1 custom-scrollbar h-screen">
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

								{/* Endpoints */}
								{openCollections[collection.id] && (
									<div className="pb-2">
										{collection.endpoints.map((endpoint) => {
											const endpointPath = `/project/${projectId}/collection/${collection.id}/request/${endpoint.id}`;
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
																	onBlur={async (e) => {
																		await handleRenameEndpoint(
																			project.id,
																			collection.id,
																			endpoint.id,
																			e.target.value
																		);
																		setRenamingEndpointId(null);
																		e.stopPropagation();
																	}}
																	onKeyDown={async (e) => {
																		if (e.key === "Enter") {
																			await handleRenameEndpoint(
																				project.id,
																				collection.id,
																				endpoint.id,
																				(e.target as HTMLInputElement).value
																			);
																			setRenamingEndpointId(null);
																			e.stopPropagation();
																		}
																		if (e.key === "Escape") {
																			setRenamingEndpointId(null);
																			e.stopPropagation();
																		}
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

			{/* Dialogs */}
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
						toast.success("Collection deleted successfully");
					}}
				/>
			)}
			{endpointToDelete && (
				<DeleteEndpoint
					open={!!endpointToDelete}
					onOpenChange={(open) => {
						if (!open) setEndpointToDelete(null);
					}}
					onConfirm={async () => {
						const { projectId, collectionId, endpointId } = endpointToDelete;
						try {
							console.log("Deleting endpoint:", endpointId); // Debug log
							await deleteRequestAction(collectionId, endpointId);
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
							toast.success("Endpoint deleted successfully");
						} catch (error: any) {
							console.error("Failed to delete endpoint:", error);
							toast.error(
								`Failed to delete endpoint: ${error.message || "Unknown error"}`
							);
						}
						setEndpointToDelete(null);
					}}
				/>
			)}
		</>
	);
};
