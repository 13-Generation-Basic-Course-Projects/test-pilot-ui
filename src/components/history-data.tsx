"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Folder, Play, Trash2 } from "lucide-react";

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

type RowData = {
	date: string;
	method: React.ReactNode;
	endPoint: string;
	status: React.ReactNode;
	action?: React.ReactNode;
};


export function HistoryData() {
	const [isOpen, setIsOpen] = React.useState(true);
	const [activeRow, setActiveRow] = React.useState<number | null>(null);
	const [data, setData] = React.useState<RowData[]>([
		{
			date: "20 May 19:00 PM",
			method: (
				<div className="w-fit border border-[#E2E8F0] rounded-md px-[15px] text-[#006FEE]">
					PUT
				</div>
			),
			endPoint: "api/v1/habits/habit-id",
			status: (
				<div className="flex justify-between max-w-[120px]">
					<p className="text-[#17C964]">Passed</p>
					<div className="w-fit border border-[#E2E8F0] rounded-sm px-[15px] text-[#17C964]">
						200
					</div>
				</div>
			),
		},
		{
			date: "20 May 19:00 PM",
			method: (
				<div className="w-fit border border-[#E2E8F0] rounded-md px-[15px] text-[#006FEE]">
					PUT
				</div>
			),
			endPoint: "api/v1/habits/habit-id",
			status: (
				<div className="flex justify-between max-w-[120px]">
					<p className="text-[#EF4444]">Failed</p>
					<div className="w-fit border border-[#E2E8F0] rounded-sm px-[15px] text-[#17C964]">
						200
					</div>
				</div>
			),
		},
		{
			date: "20 May 19:00 PM",
			method: (
				<div className="w-fit border border-[#E2E8F0] rounded-md px-[15px] text-[#006FEE]">
					PUT
				</div>
			),
			endPoint: "api/v1/habits/habit-id",
			status: (
				<div className="flex justify-between max-w-[120px]">
					<p className="text-[#EF4444]">Failed</p>
					<div className="w-fit border border-[#E2E8F0] rounded-sm px-[15px] text-[#EF4444]">
						500
					</div>
				</div>
			),
		},
		{
			date: "20 May 19:00 PM",
			method: (
				<div className="w-fit border border-[#E2E8F0] rounded-md px-[15px] text-[#006FEE]">
					PUT
				</div>
			),
			endPoint: "api/v1/habits/habit-id",
			status: (
				<div className="flex justify-between max-w-[120px]">
					<p className="text-[#EF4444]">Failed</p>
					<div className="w-fit border border-[#E2E8F0] rounded-sm px-[15px] text-[#EF4444]">
						500
					</div>
				</div>
			),
		},
	]);

	const [deleteIndex, setDeleteIndex] = React.useState<number | null>(null);

	const handleDelete = () => {
		if (deleteIndex !== null) {
			setData(prev => prev.filter((_, idx) => idx !== deleteIndex));
			setDeleteIndex(null);
		}
	};

	return (
		<Collapsible
			open={isOpen}
			onOpenChange={setIsOpen}
			className="w-full space-y-2"
		>
			<div className="flex items-center justify-between space-x-4 px-4 border py-3 rounded-md">
				<h4 className="text-lg font-semibold flex gap-2 items-center">
					<Folder />
					request #1
				</h4>
				<CollapsibleTrigger asChild>
					<button aria-label="Toggle">
						{isOpen ? (
							<ChevronUp className="h-5 w-5 cursor-pointer" />
						) : (
							<ChevronDown className="h-5 w-5 cursor-pointer" />
						)}
					</button>
				</CollapsibleTrigger>
			</div>

			<AnimatePresence initial={false}>
				{isOpen && (
					<motion.div
						key="content"
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.5, ease: "easeInOut" }}
						className="overflow-hidden"
					>
						<div className="space-y-2">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="pl-6 text-base py-4">Date</TableHead>
										<TableHead className="text-base py-4">Method</TableHead>
										<TableHead className="text-base py-4">Endpoint</TableHead>
										<TableHead className="text-base py-4">Status</TableHead>
										<TableHead className="text-base py-4">Action</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.map((item, index) => (
										<TableRow
											key={index}
											onClick={() => setActiveRow(index)}
											className={`py-5 cursor-pointer ${activeRow === index ? "bg-[#F1F5F9]" : ""
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
																<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
																<AlertDialogDescription>
																	This action cannot be undone. This will permanently delete your
																	endpoint.
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
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</Collapsible>
	);
}
