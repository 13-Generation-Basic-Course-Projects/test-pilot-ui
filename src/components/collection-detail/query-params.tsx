"use client";
import { useState } from "react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

import { Trash2, Plus, X } from "lucide-react";
import { useParamsApiStore } from "@/store/params-api-slice";
import { Button } from "../ui/button";

interface ParamRow {
	key: string;
	value: string;
	cases: string[];
}

export default function QueryParams() {
	const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

	const { queryParams, setQueryParams } = useParamsApiStore();

	const handleAddRow = () => {
		setQueryParams([...queryParams, { key: "", value: "", cases: [] }]);
	};

	const handleChange = (
		index: number,
		field: keyof ParamRow,
		newValue: string | string[]
	) => {
		const updatedRows = [...queryParams];
		updatedRows[index][field] = newValue as never;
		setQueryParams(updatedRows);
	};

	const handleToggleCase = (index: number, selectedCase: string) => {
		const updatedRows = [...queryParams];
		const currentCases = updatedRows[index].cases;

		const exists = currentCases.includes(selectedCase);
		updatedRows[index].cases = exists
			? currentCases.filter((c) => c !== selectedCase)
			: [...currentCases, selectedCase];

		setQueryParams(updatedRows);
	};

	const handleRemoveCase = (index: number, caseToRemove: string) => {
		const updatedRows = [...queryParams];
		updatedRows[index].cases = updatedRows[index].cases.filter(
			(c) => c !== caseToRemove
		);
		setQueryParams(updatedRows);
	};

	const caseOptions = [
		"Empty String",
		"Null Value",
		"Length",
		"Number String",
		"Alphanumeric Mix",
		"Only Space",
		"Special Character",
	];

	const handleDeleteRow = () => {
		if (deleteIndex !== null) {
			setQueryParams(queryParams.filter((_, i) => i !== deleteIndex));
			setDeleteIndex(null);
		}
	};

	return (
		<div className="space-y-5">
			{/* Bordered & Rounded Table Container */}
			<div className="border border-gray-300 rounded-md overflow-hidden w-full m mx-auto">
				<Table className="w-full">
					<TableHeader>
						<TableRow>
							<TableHead className="px-4 py-3 font-semibold text-left text-sm text-gray-700 border-r border-gray-300">
								Key
							</TableHead>
							<TableHead className="px-4 py-3 font-semibold text-left text-sm text-gray-700 border-r border-gray-300">
								Value
							</TableHead>
							<TableHead className="px-4 py-3 font-semibold text-left text-sm text-gray-700 border-r border-gray-300">
								Case
							</TableHead>
							<TableHead className="px-4 py-3 font-semibold text-left text-sm text-gray-700">
								Action
							</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{queryParams.map((row, index) => (
							<TableRow
								key={index}
								className="hover:bg-gray-50 border-b border-gray-200"
							>
								{/* Key Input */}
								<TableCell className="py-2 border-r border-gray-200">
									<input
										type="text"
										value={row.key}
										onChange={(e) => handleChange(index, "key", e.target.value)}
										className="w-full px-2 py-1 text-sm border border-transparent focus:outline-none focus:border-gray-300 bg-transparent"
										placeholder="Enter key"
									/>
								</TableCell>

								{/* Value Input */}
								<TableCell className="px-4 py-2 border-r border-gray-200">
									<input
										type="text"
										value={row.value}
										onChange={(e) =>
											handleChange(index, "value", e.target.value)
										}
										className="w-full px-2 py-1 text-sm border border-transparent focus:outline-none focus:border-gray-300 bg-transparent"
										placeholder="Enter value"
									/>
								</TableCell>

								{/* Case Selection */}
								<TableCell className="px-4 py-2 border-r border-gray-200 flex items-center justify-end gap-6 flex-row-reverse">
									<div className="flex flex-wrap items-center">
										{row.cases.slice(0, 1).map((c, i) => (
											<span
												key={i}
												className="bg-black text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
											>
												{c}
												<X
													className="w-3 h-3 cursor-pointer"
													onClick={() => handleRemoveCase(index, c)}
												/>
											</span>
										))}
										{row.cases.length > 1 && (
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														className="cursor-pointer size-3"
														variant="link"
													>
														+{row.cases.length - 1}
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent className="max-h-48 overflow-y-auto w-[200px] space-y-3">
													{row.cases.map((c, i) => (
														<div
															key={i}
															className="flex items-center justify-between px-2 py-1 text-sm hover:bg-gray-100"
														>
															<span>{c}</span>
															<X
																className="w-3 h-3 cursor-pointer"
																onClick={() => handleRemoveCase(index, c)}
															/>
														</div>
													))}
												</DropdownMenuContent>
											</DropdownMenu>
										)}
									</div>

									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="secondary" className="size-6">
												<Plus />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent className="max-h-48 overflow-y-auto w-[220px] space-y-4">
											{caseOptions.map((option) => (
												<DropdownMenuItem
													key={option}
													onClick={() => handleToggleCase(index, option)}
													className={`cursor-pointer ${
														row.cases.includes(option)
															? "bg-blue-100 font-semibold rounded"
															: ""
													}`}
												>
													{option}
												</DropdownMenuItem>
											))}
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>

								{/* Action Button */}
								<TableCell className="px-4 py-2">
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button
												variant="ghost"
												className="flex justify-center items-center"
												onClick={() => setDeleteIndex(index)}
											>
												<Trash2
													className="text-[#E2001A] cursor-pointer"
													width={20}
												/>
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													Are you absolutely sure?
												</AlertDialogTitle>
												<AlertDialogDescription>
													This action cannot be undone. This will permanently
													delete your variable.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel onClick={() => setDeleteIndex(null)}>
													Cancel
												</AlertDialogCancel>
												<AlertDialogAction onClick={handleDeleteRow}>
													Delete
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</TableCell>
							</TableRow>
						))}

						<TableRow
							onClick={handleAddRow}
							className="cursor-pointer border-t border-gray-200"
						>
							<TableCell
								colSpan={4}
								className="px-4 py-3 text-sm text-gray-500"
							>
								+ Add Variable
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
