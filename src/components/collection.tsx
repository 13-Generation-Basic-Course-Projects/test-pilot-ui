"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "./ui/input";
import {
	EditIcon,
	FileOutput,
	FilePlus2Icon,
	FilePlusIcon,
	FolderDownIcon,
	FolderOpenIcon,
	Share2Icon,
	TrashIcon,
} from "lucide-react";
import { getMethodColor } from "@/lib/utils";
import { projectsData } from "@/lib/constants";
import { CollectionItem } from "@/types";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ItemActionsDropdown } from "./dropdown-more-menu";
import { CollectionForm } from "./collection-form";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import ImportDialog from "./ui/import-dialog";
import ExportDialog from "./ui/export-dialog";
export const CollectionSidebar = () => {
	const handleExportCollectionClick = (
		e: React.MouseEvent,
		collection: string
	) => {
		e.preventDefault();
		setDialogType("export");
		setOpenCollections((prev) => ({
			...prev,
			[collection]: true,
		}));
	};
	const [openCollections, setOpenCollections] = useState<Record<
		string,
		boolean
	> | null>(null);
	const [dialogType, setDialogType] = useState<"import" | "export" | null>(
		null
	);


	const [sharePopup, setSharePopup] = useState<boolean>(false);
	const [renamePopup, setRenamePopup] = useState<boolean>(false);
	const [deletePopup, setDeletePopup] = useState<boolean>(false);
	const [collectionName, setCollectionName] = useState("");
	const [sharedCollection, setSharedCollection] =
		useState<CollectionItem | null>(null);
	useEffect(() => {
		const saved = localStorage.getItem("openCollections");
		setOpenCollections(saved ? JSON.parse(saved) : {});
	}, []);
	const [SelectedCollection, setSelectedCollection] =
		useState<CollectionItem | null>(null);
	useEffect(() => {
		const saved = localStorage.getItem("openCollections");
		setOpenCollections(saved ? JSON.parse(saved) : {});
	}, []);
	const handleSave = () => {
		console.log("Saved collection name:", collectionName);
		console.log("Saved collection name:", sharedCollection);
		console.log("Saved collection name:", SelectedCollection);
		setRenamePopup(false);
	};
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
	const handleShareClick = (
		e: React.MouseEvent,
		collection: CollectionItem
	) => {
		e.stopPropagation();
		setSharedCollection(collection);
		setSharePopup(true);
	};
	const handleRenameClick = (
		e: React.MouseEvent,
		collection: CollectionItem
	) => {
		e.stopPropagation();
		setSelectedCollection(collection);
		setRenamePopup(true);
	};
	const handleDeleteClick = (
		e: React.MouseEvent,
		collection: CollectionItem
	) => {
		e.stopPropagation();
		setSelectedCollection(collection);
		setDeletePopup(true);
	};
	const getCollectionMenuItems = (collection: CollectionItem) => [
		{
			icon: <FilePlusIcon className="w-4 h-4" />,
			label: "Add Request",
			onClick: (e: React.MouseEvent) => {
				e.stopPropagation();
				console.log("Add request to collection:", collection.id);
			},
		},
		{ isSeparator: true as const },
		{
			icon: <Share2Icon className="w-4 h-4" />,
			label: "Share",
			onClick: (e: React.MouseEvent) => handleShareClick(e, collection),
		},
		{ isSeparator: true as const },
		{
			icon: <EditIcon className="w-4 h-4" />,
			label: "Rename",
			onClick: (e: React.MouseEvent) => handleRenameClick(e, collection),
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
			onClick: (e: React.MouseEvent) =>
				handleExportCollectionClick(e, collection.id),
		},

		{
			icon: <TrashIcon className="w-4 h-4" />,
			label: "Delete",
			onClick: (e: React.MouseEvent) => handleDeleteClick(e, collection),
			className: "text-red-600 hover:!text-red-600 hover:!bg-red-50",
		},
	];
	return (
		<div className="flex h-screen items-start relative self-stretch w-fit">
			<div className="flex flex-col w-[400px] items-start relative self-stretch border-r border-[#e2e2e2]">
				{/* Header */}
				<div className="flex w-[400px] items-center justify-between px-[17px] py-5 border-b border-slate-200">
					<CollectionForm />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="cursor-pointer">
								<FolderDownIcon className="w-6 h-6" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem onClick={() => setDialogType("import")}>
								Import
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setDialogType("export")}>
								Export
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				{/* Import/Export Dialog */}
				<Dialog
					open={dialogType !== null}
					onOpenChange={() => setDialogType(null)}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								<p className="text-2xl text-center mb-6">
									{dialogType === "import" ? "" : ""}
								</p>
							</DialogTitle>
						</DialogHeader>
						{dialogType === "import" ? (
							<ImportDialog />
						) : (
							<ExportDialog onClose={() => setDialogType(null)} />
						)}
					</DialogContent>
				</Dialog>
				{/* Share Dialog */}
				<Dialog open={sharePopup} onOpenChange={setSharePopup}>
					<DialogContent className="sm:max-w-md rounded-xl">
						<DialogHeader>
							<DialogTitle className="text-[#0F172A] text-[18px]">
								Share collection
							</DialogTitle>
						</DialogHeader>
						<div className="flex items-center gap-2 mt-4 text-sm">
							<label htmlFor="link" className="text-gray-700 whitespace-nowrap">
								Link:
							</label>
							<div className="flex-1 relative">
								<Input
									id="link"
									type="text"
									value="test-pilot/share/a1b2c3d4-e5f6-7890-1234-567890abcdef"
									readOnly
									className="flex-1 w-full bg-gray-100 rounded px-2 py-1 pr-8 text-sm text-gray-800 border border-gray-300"
								/>
								<button
									className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200 transition"
									aria-label="Copy to clipboard"
								>
									<svg
										className="w-4 h-4 text-gray-600"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 448 512"
									>
										<path d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l140.1 0L400 115.9 400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-204.1c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-32-48 0 0 32c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l32 0 0-48-32 0z" />
									</svg>
								</button>
							</div>

							<Button
								className="ml-2 whitespace-nowrap"
								onClick={() => setSharePopup(false)}
							>
								Share
							</Button>
						</div>
					</DialogContent>
				</Dialog>

				{/* Rename */}
				<Dialog open={renamePopup} onOpenChange={setRenamePopup}>
					<DialogContent className="sm:max-w-md rounded-xl">
						<DialogHeader>
							<DialogTitle>Rename</DialogTitle>
						</DialogHeader>

						<div className="mt-4">
							<p className="font-semibold mb-2">Name Collection</p>
							<Input
								type="text"
								placeholder="Enter new name"
								value={collectionName}
								onChange={(e) => setCollectionName(e.target.value)}
								className="bg-muted px-2"
							/>
						</div>

						<div className="flex justify-end gap-2 mt-6">
							<Dialog>
								<Button variant="outline">Cancel</Button>
							</Dialog>
							<Button onClick={handleSave}>Save</Button>
						</div>
					</DialogContent>
				</Dialog>
				{/* Delete */}
				<Dialog open={deletePopup} onOpenChange={setDeletePopup}>
					<DialogContent className="sm:max-w-md rounded-xl">
						<DialogHeader>
							<DialogTitle className="text-[#0F172A] text-[18px]">
								Are you sure to delete this collection?
							</DialogTitle>
						</DialogHeader>
						<div className="mt-4 text-sm text-[#64748B]">
							This action cannot be undone. This will <br /> permanently delete
							your collection{" "}
							<span className="font-semibold">{collectionName}</span>.
						</div>
						<div className="flex justify-end gap-2 mt-6">
							<Button variant="outline">Cancel</Button>
							<Button variant="destructive">Delete</Button>
						</div>
					</DialogContent>
				</Dialog>
				{/* Collection List */}
				<div className="w-full overflow-y-auto">
					{projectsData.map((project) => (
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
										<div className="flex items-center gap-3">
											{/* {openCollections[collection.id] ? ( */}
											<FolderOpenIcon className="w-5 h-5 text-slate-600" />
											{/* ) : (
                        <Folder className="w-5 h-5 text-slate-600" />
                      )} */}
											<span className="text-[15px] font-medium">
												{collection.title}
											</span>
										</div>
										<ItemActionsDropdown
											items={getCollectionMenuItems(collection)}
										/>
									</div>
									{/* {openCollections[collection.id] && ( */}
									<div className="pl-10 pr-4 py-1 space-y-1">
										{collection.endpoints.map((endpoint) => (
											<Link
												key={`${collection.id}-${endpoint.id}`}
												href={`/project/${collection.id}/request/${endpoint.id}`}
												className="group relative flex items-center justify-between hover:bg-slate-100 cursor-pointer rounded-lg p-1 pr-2"
												onMouseDown={(e) => e.stopPropagation()}
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
													<span className="text-[15px] text-slate-600">
														{endpoint.path}
													</span>
												</div>
												{/* You can also add endpoint share actions here */}
											</Link>
										))}
									</div>
									{/* )} */}
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
