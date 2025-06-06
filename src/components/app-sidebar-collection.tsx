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
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { getMethodColor } from "@/lib/utils";
import { CollectionItem, Endpoint, Project } from "@/types";
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
	const [openCollections, setOpenCollections] = useState<
		Record<string, boolean>
	>({});
	const [renamingCollectionId, setRenamingCollectionId] = useState<
		string | null
	>(null);
	const [renamingEndpointId, setRenamingEndpointId] = useState<string | null>(
		null
	);
	const [project, setProject] = useState<Project | null>(null);
	const [isDataLoaded, setIsDataLoaded] = useState(false);

	// State for modals
	const [collectionToDelete, setCollectionToDelete] =
		useState<CollectionItem | null>(null);
	const [endpointToDelete, setEndpointToDelete] = useState<Endpoint | null>(
		null
	);
	const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(
		null
	);
	const [selectedCollection, setSelectedCollection] =
		useState<CollectionItem | null>(null);
	const [isExportRequestOpen, setIsExportRequestOpen] = useState(false);
	const [isExportCollectionOpen, setIsExportCollectionOpen] = useState(false);
	const [isImportCollectionOpen, setIsImportCollectionOpen] = useState(false);
	const [isShareCollectionOpen, setIsShareCollectionOpen] = useState(false);
	const [isShareEndpointOpen, setIsShareEndpointOpen] = useState(false);

	const pathname = usePathname();
	const currentProjectId = pathname.split("/")[2] || null;

	useEffect(() => {
		if (currentProjectId) {
			try {
				const projectKey = `project-data-${currentProjectId}`;
				const savedProjectJSON = localStorage.getItem(projectKey);
				setProject(savedProjectJSON ? JSON.parse(savedProjectJSON) : null);
			} catch (error) {
				console.error("Error parsing project data:", error);
				setProject(null);
			}
		} else {
			setProject(null);
		}
		const savedOpen = localStorage.getItem("openCollections");
		setOpenCollections(savedOpen ? JSON.parse(savedOpen) : {});
		setIsDataLoaded(true);
	}, [currentProjectId]);

	useEffect(() => {
		if (isDataLoaded && project && currentProjectId) {
			localStorage.setItem(
				`project-data-${currentProjectId}`,
				JSON.stringify(project)
			);
		}
		if (isDataLoaded) {
			localStorage.setItem("openCollections", JSON.stringify(openCollections));
		}
	}, [project, openCollections, isDataLoaded, currentProjectId]);

	const updateProject = (updater: (prev: Project) => Project | null) => {
		setProject((prev) => (prev ? updater(prev) : null));
	};

	const handleCreateCollection = (title: string) => {
		if (!project) return;
		const newCollection: CollectionItem = {
			id: `collection-${Date.now()}`,
			title,
			endpoints: [],
		};
		updateProject((p) => ({
			...p,
			collections: [...(p.collections || []), newCollection],
		}));
	};

	const handleAddEndpoint = (collectionId: string) => {
		const newEndpoint: Endpoint = {
			id: `endpoint-${Date.now()}`,
			method: "GET",
			path: "/new-request",
		};
		updateProject((p) => ({
			...p,
			collections: p.collections.map((c) =>
				c.id === collectionId
					? { ...c, endpoints: [...(c.endpoints || []), newEndpoint] }
					: c
			),
		}));
		setOpenCollections((prev) => ({ ...prev, [collectionId]: true }));
	};

	const handleRenameCollection = (collectionId: string, newTitle: string) => {
		updateProject((p) => ({
			...p,
			collections: p.collections.map((c) =>
				c.id === collectionId ? { ...c, title: newTitle } : c
			),
		}));
	};
	const handleDuplicateCollection = (collectionId: string) => {
		updateProject((p) => {
			const collectionToDuplicate = p.collections.find(
				(c) => c.id === collectionId
			);
			if (!collectionToDuplicate) return p;

			const duplicated = {
				...collectionToDuplicate,
				// ID remains unique for React keys
				id: crypto.randomUUID(),
				// Append " copy" to the user-visible title
				title: `${collectionToDuplicate.title} copy`,
				// Endpoints inside also get new unique IDs
				endpoints: (collectionToDuplicate.endpoints || []).map((ep) => ({
					...ep,
					id: crypto.randomUUID(),
				})),
			};
			return { ...p, collections: [...p.collections, duplicated] };
		});
	};
	const handleRenameEndpoint = (
		collectionId: string,
		endpointId: string,
		newPath: string
	) => {
		updateProject((p) => ({
			...p,
			collections: p.collections.map((c) =>
				c.id === collectionId
					? {
							...c,
							endpoints: (c.endpoints || []).map((ep) =>
								ep.id === endpointId ? { ...ep, path: newPath } : ep
							),
					  }
					: c
			),
		}));
	};

	const handleDuplicateEndpoint = (
		collectionId: string,
		endpointId: string
	) => {
		updateProject((p) => ({
			...p,
			collections: p.collections.map((c) => {
				if (c.id !== collectionId) return c;
				const endpointToDuplicate = (c.endpoints || []).find(
					(ep) => ep.id === endpointId
				);
				if (!endpointToDuplicate) return c;

				const duplicated = {
					...endpointToDuplicate,
					// ID remains unique for React keys
					id: crypto.randomUUID(),
					// Append " copy" to the user-visible path
					path: `${endpointToDuplicate.path} copy`,
				};

				return { ...c, endpoints: [...(c.endpoints || []), duplicated] };
			}),
		}));
	};

	const getCollectionMenuItems = (collection: CollectionItem) => [
		{
			icon: <FilePlusIcon className="w-4 h-4" />,
			label: "Add Request",
			onClick: () => handleAddEndpoint(collection.id),
		},
		{ isSeparator: true as const },
		{
			icon: <Share2Icon className="w-4 h-4" />,
			label: "Share",
			onClick: () => {
				setSelectedCollection(collection);
				setIsShareCollectionOpen(true);
			},
		},
		{ isSeparator: true as const },
		{
			icon: <EditIcon className="w-4 h-4" />,
			label: "Rename",
			onClick: () => setRenamingCollectionId(collection.id),
		},
		{
			icon: <FilePlus2Icon className="w-4 h-4" />,
			label: "Duplicate",
			onClick: () => handleDuplicateCollection(collection.id),
		},
		{
			icon: <FileOutput className="w-4 h-4" />,
			label: "Export",
			onClick: () => {
				setSelectedCollection(collection);
				setIsExportCollectionOpen(true);
			},
		},
		{
			icon: <TrashIcon className="w-4 h-4 text-red-500" />,
			label: <span className="text-red-500">Delete</span>,
			onClick: () => setCollectionToDelete(collection),
		},
	];

	const getEndpointMenuItems = (endpoint: Endpoint, collectionId: string) => [
		{
			icon: <Share2Icon className="w-4 h-4" />,
			label: "Share",
			onClick: () => {
				setSelectedEndpoint(endpoint);
				setIsShareEndpointOpen(true);
			},
		},
		{ isSeparator: true as const },
		{
			icon: <EditIcon className="w-4 h-4" />,
			label: "Rename",
			onClick: () => setRenamingEndpointId(endpoint.id),
		},
		{
			icon: <FilePlus2Icon className="w-4 h-4" />,
			label: "Duplicate",
			onClick: () => handleDuplicateEndpoint(collectionId, endpoint.id),
		},
		{
			icon: <FileOutput className="w-4 h-4" />,
			label: "Export",
			onClick: () => {
				setSelectedEndpoint(endpoint);
				setIsExportRequestOpen(true);
			},
		},
		{
			icon: <TrashIcon className="w-4 h-4 text-red-500" />,
			label: <span className="text-red-500">Delete</span>,
			onClick: () => setEndpointToDelete(endpoint),
		},
	];

	if (!isDataLoaded)
		return (
			<div className="w-80 border-r bg-background h-full p-4 flex items-center justify-center">
				Loading...
			</div>
		);
	if (!isCollectionSidebarOpen)
		return (
			<div className="border-r bg-background h-full p-2">
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

	return (
		<>
			<div className="w-80 border-r bg-background duration-300 flex flex-col h-full">
				<div className="flex items-center justify-between p-4 border-b">
					<CollectionForm
						onCollectionCreate={handleCreateCollection}
						// disabled={!currentProjectId}
					/>
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
									Export All
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

				<div className="flex-1 custom-scrollbar overflow-y-auto">
					{project ? (
						(project.collections || []).map((collection) => (
							<div key={collection.id}>
								<div
									className="group flex items-center justify-between px-4 py-3 mb-2 hover:bg-muted/50 cursor-pointer"
									onClick={() =>
										setOpenCollections((prev) => ({
											...prev,
											[collection.id]: !prev[collection.id],
										}))
									}
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
													handleRenameCollection(collection.id, e.target.value);
													setRenamingCollectionId(null);
												}}
												onKeyDown={(e) => {
													if (e.key === "Enter")
														(e.target as HTMLInputElement).blur();
													if (e.key === "Escape") setRenamingCollectionId(null);
												}}
												className="h-6"
											/>
										) : (
											<span className="font-medium">{collection.title}</span>
										)}
									</div>
									<ItemActionsDropdown
										items={getCollectionMenuItems(collection)}
									/>
								</div>
								{openCollections[collection.id] && (
									<div className="pb-2">
										{(collection.endpoints || []).map((endpoint) => {
											const endpointPath = `/project/${project.id}/collection/${collection.id}/request/${endpoint.id}`;
											return (
												<div
													key={endpoint.id}
													className="group mx-4 mb-1 rounded-md hover:bg-muted/50"
												>
													<Link
														href={endpointPath}
														className="flex items-center justify-between gap-2 p-2"
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
																	onClick={(e) => e.preventDefault()}
																	onBlur={(e) => {
																		handleRenameEndpoint(
																			collection.id,
																			endpoint.id,
																			e.target.value
																		);
																		setRenamingEndpointId(null);
																	}}
																	onKeyDown={(e) => {
																		if (e.key === "Enter")
																			(e.target as HTMLInputElement).blur();
																		if (e.key === "Escape")
																			setRenamingEndpointId(null);
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
																collection.id
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
					) : (
						<div className="p-4 text-center text-muted-foreground">
							No project selected or found.
						</div>
					)}
				</div>
			</div>

			{/* Dialogs */}
			<ExportEndpoint
				open={isExportRequestOpen}
				onOpenChange={setIsExportRequestOpen}
				endpoint={selectedEndpoint}
			/>
			<ExportCollection
				open={isExportCollectionOpen}
				onOpenChange={setIsExportCollectionOpen}
				// collection={selectedCollection}
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
					onOpenChange={(open) => !open && setCollectionToDelete(null)}
					onConfirm={() => {
						updateProject((p) => ({
							...p,
							collections: p.collections.filter(
								(c) => c.id !== collectionToDelete.id
							),
						}));
						setCollectionToDelete(null);
					}}
				/>
			)}
			{endpointToDelete && (
				<DeleteEndpoint
					open={!!endpointToDelete}
					onOpenChange={(open) => !open && setEndpointToDelete(null)}
					onConfirm={() => {
						updateProject((p) => ({
							...p,
							collections: p.collections.map((c) => ({
								...c,
								endpoints: (c.endpoints || []).filter(
									(ep) => ep.id !== endpointToDelete.id
								),
							})),
						}));
						setEndpointToDelete(null);
					}}
				/>
			)}
		</>
	);
};
