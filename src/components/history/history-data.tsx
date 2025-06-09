"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	ChevronDown,
	ChevronUp,
	Folder,
	Play,
	Trash2,
	SquarePen,
} from "lucide-react";

import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TableRowV2,
} from "@/components/ui/table";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MethodBadge } from "../method-badge";
import { Button } from "../ui/button";

type RowData = {
	date: string;
	method: React.ReactNode;
	endPoint: string;
	status: React.ReactNode;
};

type HistoryDataType = {
	setActiveRequestIndex?: (index: number) => void;
};

export function HistoryData({ setActiveRequestIndex }: HistoryDataType) {
	const [isOpen, setIsOpen] = React.useState(true);
	const [activeRow, setActiveRow] = React.useState<number | null>(null);
	const [deleteIndex, setDeleteIndex] = React.useState<number | null>(null);

	// Rename history
	const [isRenaming, setIsRenaming] = React.useState(false);
	const [historyTitle, setHistoryTitle] = React.useState("Request History");
	const [renameInput, setRenameInput] = React.useState(historyTitle);
	const [showRenameDialog, setShowRenameDialog] = React.useState(false);

	const inputRef = React.useRef<HTMLInputElement>(null);
	const wrapperRef = React.useRef<HTMLDivElement>(null);
	const [data, setData] = React.useState<RowData[]>([
		{
			date: "06 Jan 10:15 AM",
			method: <MethodBadge method="POST" />,
			endPoint: "http://96.9.81.187:8787/login",
			status: (
				<div className="flex justify-between max-w-[120px]">
					<p className="text-[#17C964]">Passed</p>
					<div className="w-fit border border-[#E2E8F0] rounded-sm px-[15px] text-[#17C964]">
						400
					</div>
				</div>
			),
		},

		{
			date: "06 Jan 10:15 AM",
			method: <MethodBadge method="POST" />,
			endPoint: "http://96.9.81.187:8787/login",
			status: (
				<div className="flex justify-between max-w-[120px]">
					<p className="text-[#EF4444]">Failed</p>
					<div className="w-fit border border-[#E2E8F0] rounded-sm px-[15px] text-[#EF4444]">
						200
					</div>
				</div>
			),
		},
		{
			date: "06 Jan 10:15 AM",
			method: <MethodBadge method="POST" />,
			endPoint: "http://96.9.81.187:8787/login",
			status: (
				<div className="flex justify-between max-w-[120px]">
					<p className="text-[#17C964]">Passed</p>
					<div className="w-fit border border-[#E2E8F0] rounded-sm px-[15px] text-[#17C964]">
						400
					</div>
				</div>
			),
		},
	]);

	// Auto-save on outside click
	const handleClickOutside = (event: MouseEvent) => {
		if (
			wrapperRef.current &&
			!wrapperRef.current.contains(event.target as Node)
		) {
			const newTitle = renameInput.trim() || "Request History";
			setHistoryTitle(newTitle);
			setIsRenaming(false);
			console.log("New history title:", newTitle);
		}
	};

	const handleDelete = () => {
		if (deleteIndex !== null) {
			setData((prev) => prev.filter((_, idx) => idx !== deleteIndex));
			setDeleteIndex(null);
		}
	};

	React.useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [renameInput]);

	return (
		<Collapsible
			open={isOpen}
			onOpenChange={setIsOpen}
			className="w-full space-y-2"
		>
			<CollapsibleTrigger asChild>
				<div
					className="flex items-center justify-between space-x-4 px-4 border py-3 rounded-md cursor-pointer select-none"
					ref={wrapperRef}
					onClick={(e) => {
						// Prevent toggling collapsible when renaming (input visible)
						if (isRenaming) {
							e.stopPropagation();
						}
					}}
				>
					<div className="flex items-center gap-2">
						<Folder />
						{isRenaming ? (
							<input
								ref={inputRef}
								type="text"
								className="border px-2 py-1 rounded text-sm"
								value={renameInput}
								onChange={(e) => setRenameInput(e.target.value)}
								autoFocus
								onClick={(e) => e.stopPropagation()} // prevent collapse toggle
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										const newTitle = renameInput.trim() || "Request History";
										setHistoryTitle(newTitle);
										setIsRenaming(false);
									}
								}}
							/>
						) : (
							<>
								<h4 className="text-lg font-semibold flex items-center gap-1">
									{historyTitle}
								</h4>

								<AlertDialog
									open={showRenameDialog}
									onOpenChange={setShowRenameDialog}
								>
									<AlertDialogTrigger asChild>
										<button
											onClick={(e) => {
												e.stopPropagation(); // Prevent toggle when rename clicked
												setShowRenameDialog(true);
											}}
											aria-label="Rename Folder"
											className="pt-1"
										>
											<SquarePen className="cursor-pointer w-4 h-4 text-gray-500 hover:text-gray-700" />
										</button>
									</AlertDialogTrigger>

									<AlertDialogContent
										onClick={(e) => e.stopPropagation()} // prevent collapse toggle if clicked inside dialog
									>
										<AlertDialogHeader>
											<AlertDialogTitle>Rename Folder</AlertDialogTitle>
											<AlertDialogDescription>
												Do you want to rename this folder?
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel
												onClick={() => setShowRenameDialog(false)}
												onPointerDown={(e) => e.stopPropagation()} // prevent toggle
											>
												Cancel
											</AlertDialogCancel>
											<Button
												onClick={() => {
													setRenameInput(historyTitle);
													setIsRenaming(true);
													setShowRenameDialog(false);
													setTimeout(() => {
														inputRef.current?.focus();
													}, 0);
												}}
												onPointerDown={(e) => e.stopPropagation()} // prevent toggle
											>
												Rename
											</Button>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</>
						)}
					</div>

					{isOpen ? (
						<ChevronUp className="h-5 w-5 text-muted-foreground" />
					) : (
						<ChevronDown className="h-5 w-5 text-muted-foreground" />
					)}
				</div>
			</CollapsibleTrigger>

			<AnimatePresence initial={false}>
				{isOpen && (
					<motion.div
						key="content"
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="overflow-hidden"
					>
						<Table>
							<TableHeader>
								<TableRowV2>
									<TableHead className="pl-6 text-base py-4 min-w-[120px]">
										Date
									</TableHead>
									<TableHead className="text-base py-4 min-w-[80px]">
										Method
									</TableHead>
									<TableHead className="text-base py-4 min-w-[200px]">
										Endpoint
									</TableHead>
									<TableHead className="text-base py-4 min-w-[100px]">
										Status
									</TableHead>
									<TableHead className="text-base py-4 min-w-[80px]">
										Action
									</TableHead>
								</TableRowV2>
							</TableHeader>
							<TableBody>
								{data.map((item, index) => (
									<TableRow
										key={index}
										id={`request-${index}`}
										onClick={() => {
											setActiveRow(index);
											setActiveRequestIndex?.(index);
											document
												.getElementById(`request-${index}`)
												?.scrollIntoView({
													behavior: "smooth",
													block: "center",
												});
										}}
										className={`py-5 cursor-pointer ${
											activeRow === index ? "bg-[#F1F5F9]" : ""
										}`}
									>
										<TableCell className="py-5 pl-6">{item.date}</TableCell>
										<TableCell className="py-5">{item.method}</TableCell>
										<TableCell className="py-5">{item.endPoint}</TableCell>
										<TableCell className="py-5">{item.status}</TableCell>
										<TableCell className="py-5">
											<div className="flex gap-3">
												<Play className="text-[#3B82F6]" width={20} />
												<AlertDialog>
													<AlertDialogTrigger asChild>
														<Trash2
															className="text-[#E2001A] cursor-pointer"
															width={20}
															onClick={(e) => {
																e.stopPropagation();
																setDeleteIndex(index);
															}}
														/>
													</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogTitle>
																Are you absolutely sure?
															</AlertDialogTitle>
															<AlertDialogDescription>
																This action cannot be undone. This will
																permanently delete your endpoint.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>Cancel</AlertDialogCancel>
															<AlertDialogAction
																onClick={handleDelete}
																className="bg-[#EF4444] text-white hover:bg-[#dc2626]"
															>
																Delete
															</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</motion.div>
				)}
			</AnimatePresence>
		</Collapsible>
	);
}
