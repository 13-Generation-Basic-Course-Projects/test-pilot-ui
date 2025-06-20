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
import { MethodBadge } from "@/components/method-badge";
import { Button } from "@/components/ui/button";

type BackendResponse = {
	message: string;
	status: string;
	success: boolean;
	timestamps: any;
	payload: Array<{
		batchId: string;
		projectId: string;
		userId: string;
		triggerType: string;
		triggerSourceId: string | null;
		startTimestamp: string;
		endTimestamp: string;
		overallStatus: string;
		results: Array<{
			resultId: string;
			batchId: string;
			requestId: string;
			testCaseId: string;
			isExpectedSuccess: boolean;
			requestDefinitionSnapshot: any;
			executionOrder: number;
			startTimestamp: string;
			endTimestamp: string;
			status: string;
			requestSentDetails: {
				url: string;
				body: any;
				method: string;
				headers: any;
			};
			responseStatusCode: number;
			responseHeaders: any;
			responseBody: string;
			responseSizeBytes: number;
			durationMs: number;
			assertionResults: any;
			createdAt: string;
		}>;
		createdAt: string;
		updatedAt: string;
	}>;
};

type HistoryDataType = {
	backendData: BackendResponse;
	onRowClick?: (resultData: any) => void;
};

export function HistoryData({ backendData, onRowClick }: HistoryDataType) {
	const [isOpen, setIsOpen] = React.useState(true);
	const [activeRow, setActiveRow] = React.useState<string | null>(null);
	const [deleteIndex, setDeleteIndex] = React.useState<string | null>(null); // Rename history

	const [isRenaming, setIsRenaming] = React.useState(false);
	const [historyTitle, setHistoryTitle] = React.useState("Request History");
	const [renameInput, setRenameInput] = React.useState(historyTitle);
	const [showRenameDialog, setShowRenameDialog] = React.useState(false);

	const inputRef = React.useRef<HTMLInputElement>(null);
	const wrapperRef = React.useRef<HTMLDivElement>(null);

	// Transform backend data into table rows
	const transformedData = React.useMemo(() => {
		// Guard against backendData or its payload being missing
		if (!backendData || !Array.isArray(backendData.payload)) {
			return [];
		}

		const rows: Array<{
			id: string;
			date: string;
			method: string;
			endpoint: string;
			status: string;
			statusCode: number;
			resultData: any;
		}> = [];

		backendData.payload.forEach((batch) => {
			if (batch.results && Array.isArray(batch.results)) {
				batch.results.forEach((result) => {
					const date = new Date(result.startTimestamp).toLocaleString("en-US", {
						day: "numeric",
						month: "short",
						hour: "2-digit",
						minute: "2-digit",
						hour12: true,
					});

					// ---  THE FIX IS HERE ---
					// Use optional chaining (?.) to safely access nested properties.
					// Provide a fallback value (e.g., 'N/A') if the data is null or undefined.
					const method = result.requestSentDetails?.method || "N/A";
					const endpoint = result.requestSentDetails?.url || "No Endpoint";

					rows.push({
						id: result.resultId,
						date,
						method, // Use the safe variable
						endpoint, // Use the safe variable
						status: result.status,
						// Provide a fallback for statusCode as well, just in case
						statusCode: result.responseStatusCode || 0,
						resultData: result,
					});
				});
			}
		});

		return rows;
	}, [backendData]);

	// ... all your other functions and useEffects (setData, handleClickOutside, etc.) remain the same
	const [data, setData] = React.useState(transformedData);

	React.useEffect(() => {
		setData(transformedData);
	}, [transformedData]);

	const handleDelete = () => {
		if (deleteIndex !== null) {
			setData((prev) => prev.filter((item) => item.id !== deleteIndex));
			setDeleteIndex(null);
		}
	};

	const getStatusColor = (status: string, statusCode: number) => {
		if (status === "PASSED") {
			return "text-[#17C964]";
		} else {
			return "text-[#EF4444]";
		}
	};

	const getStatusCodeColor = (statusCode: number) => {
		if (statusCode >= 200 && statusCode < 300) {
			return "text-[#17C964]";
		} else if (statusCode >= 400) {
			return "text-[#EF4444]";
		} else {
			return "text-[#006FEE]";
		}
	};

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
								onClick={(e) => e.stopPropagation()}
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
												e.stopPropagation();
												setShowRenameDialog(true);
											}}
											aria-label="Rename Folder"
											className="pt-1"
										>
											<SquarePen className="cursor-pointer w-4 h-4 text-gray-500 hover:text-gray-700" />
										</button>
									</AlertDialogTrigger>

									<AlertDialogContent onClick={(e) => e.stopPropagation()}>
										<AlertDialogHeader>
											<AlertDialogTitle>Rename Folder</AlertDialogTitle>
											<AlertDialogDescription>
												Do you want to rename this folder?
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel
												onClick={() => setShowRenameDialog(false)}
												onPointerDown={(e) => e.stopPropagation()}
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
												onPointerDown={(e) => e.stopPropagation()}
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
								<TableRow>
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
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.map((item) => (
									<TableRow
										key={item.id}
										id={`request-${item.id}`}
										onClick={() => {
											setActiveRow(item.id);
											onRowClick?.(item.resultData);
											document
												.getElementById(`request-${item.id}`)
												?.scrollIntoView({
													behavior: "smooth",
													block: "center",
												});
										}}
										className={`py-5 cursor-pointer ${
											activeRow === item.id ? "bg-[#F1F5F9]" : ""
										}`}
									>
										<TableCell className="py-5 pl-6">{item.date}</TableCell>
										<TableCell className="py-5">
											<MethodBadge method={item.method} />
										</TableCell>
										<TableCell className="py-5 break-all max-w-[300px]">
											{item.endpoint}
										</TableCell>
										<TableCell className="py-5">
											<div className="flex justify-between max-w-[120px]">
												<p
													className={getStatusColor(
														item.status,
														item.statusCode
													)}
												>
													{item.status === "PASSED" ? "Passed" : "Failed"}
												</p>
												<div
													className={`w-fit border border-[#E2E8F0] rounded-sm px-[15px] ${getStatusCodeColor(
														item.statusCode
													)}`}
												>
													{item.statusCode}
												</div>
											</div>
										</TableCell>
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
																setDeleteIndex(item.id);
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
