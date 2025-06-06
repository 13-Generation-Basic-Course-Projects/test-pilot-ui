"use client";
import React, { useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/alert-dialog"; // Import AlertDialog components

import { Plus, X } from "lucide-react";
import { useApiBodyStore, ApiBodyRow } from "@/store/body-api-slice";
import { Button } from "../ui/button";

// Available data types
const dataTypeOptions = ["string", "number", "boolean", "date"] as const;
type DataType = (typeof dataTypeOptions)[number];

// Predefined case options by data type
const caseByDataType: Record<DataType, string[]> = {
	string: [
		"Empty String",
		"Null Value",
		"Length",
		"Alphanumeric Mix",
		"Only Space",
		"Special Character",
	],
	number: ["Zero", "Negative", "Non-numeric String", "Large Number"],
	boolean: ["True", "False", "Not Boolean"],
	date: ["Invalid Date", "Future Date", "Past Date", "ISO Format"],
};

export const TestCase = () => {
	const { apiBodyRows, updateRow } = useApiBodyStore();

	// State for the confirmation dialog
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
	const [dataTypeChangeInfo, setDataTypeChangeInfo] = useState<{
		rowId: string;
		oldType: string;
		newType: DataType;
	} | null>(null);

	if (!apiBodyRows || apiBodyRows.length === 0) {
		return (
			<p className="min-h-[480px]">Parse a JSON body to see test cases.</p>
		);
	}

	const handleToggleCase = (row: ApiBodyRow, selectedCase: string) => {
		const newTestCases = row.testCases.includes(selectedCase)
			? row.testCases.filter((c) => c !== selectedCase)
			: [...row.testCases, selectedCase];
		updateRow(row.id, { testCases: newTestCases });
	};

	const handleRemoveCase = (row: ApiBodyRow, caseToRemove: string) => {
		const newTestCases = row.testCases.filter((c) => c !== caseToRemove);
		updateRow(row.id, { testCases: newTestCases });
	};

	// Initiates the data type change process
	const initiateDataTypeChange = (rowId: string, newType: DataType) => {
		const currentRow = apiBodyRows.find((r) => r.id === rowId);
		if (!currentRow) {
			console.error("Row not found for data type change");
			return;
		}

		// If the type is not actually changing, do nothing.
		if (currentRow.dataType === newType) {
			return;
		}

		// If there are existing test cases, show the confirmation dialog
		if (currentRow.testCases && currentRow.testCases.length > 0) {
			setDataTypeChangeInfo({ rowId, oldType: currentRow.dataType, newType });
			setIsConfirmDialogOpen(true);
		} else {
			// No test cases to lose, so change directly and clear any (empty) test cases.
			// This also ensures testCases is an empty array for the new type.
			updateRow(rowId, { dataType: newType, testCases: [] });
		}
	};

	// Handles the confirmation of the data type change
	const handleConfirmDataTypeChange = () => {
		if (dataTypeChangeInfo) {
			updateRow(dataTypeChangeInfo.rowId, {
				dataType: dataTypeChangeInfo.newType,
				testCases: [], // Clear existing test cases
			});
		}
		setIsConfirmDialogOpen(false);
		setDataTypeChangeInfo(null);
	};

	// Handles the cancellation of the data type change
	const handleCancelDataTypeChange = () => {
		setIsConfirmDialogOpen(false);
		setDataTypeChangeInfo(null);
		// The Select component's displayed value will revert to row.dataType
		// on re-render because the Zustand store (apiBodyRows) was not updated.
	};

	return (
		<div className="space-y-5 min-h-[480px]">
			<div className="border border-gray-300 rounded-md overflow-hidden w-full mx-auto">
				<Table className="w-full">
					<TableHeader>
						<TableRow>
							<TableHead className="px-4 py-3 font-semibold text-left text-sm text-gray-700 border-r border-gray-300">
								Field
							</TableHead>
							<TableHead className="px-4 py-3 font-semibold text-left text-sm text-gray-700 border-r border-gray-300">
								Value
							</TableHead>
							<TableHead className="px-4 py-3 font-semibold text-left text-sm text-gray-700 border-r border-gray-300">
								Data Type
							</TableHead>
							<TableHead className="px-4 py-3 font-semibold text-left text-sm text-gray-700">
								Test Case
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{apiBodyRows.map((row) => (
							<TableRow
								key={row.id}
								className="hover:bg-gray-50 border-b border-gray-200"
							>
								{/* Field Name */}
								<TableCell className="py-2 border-r border-gray-200">
									<span className="block px-2 py-1 text-sm">{row.id}</span>
								</TableCell>

								{/* Value */}
								<TableCell className="px-4 py-2 border-r border-gray-200">
									<span className="block px-2 py-1 text-sm">
										{String(row.value)}
									</span>
								</TableCell>

								{/* Data Type Dropdown */}
								<TableCell className="px-4 py-2 border-r border-gray-200">
									<Select
										value={row.dataType}
										onValueChange={(value) =>
											initiateDataTypeChange(row.id, value as DataType)
										}
									>
										<SelectTrigger className="w-[130px] cursor-pointer">
											<SelectValue placeholder="String" />
										</SelectTrigger>
										<SelectContent>
											{dataTypeOptions.map((type) => (
												<SelectItem key={type} value={type}>
													{type.charAt(0).toUpperCase() + type.slice(1)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</TableCell>

								{/* Test Cases */}
								<TableCell className=" flex items-center justify-end gap-6 flex-row-reverse mt-[5px]">
									<div className="flex flex-wrap items-center">
										{row.testCases.slice(0, 1).map((c) => (
											<span
												key={c}
												className="bg-black text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
											>
												{c}
												<X
													className="w-3 h-3 cursor-pointer"
													onClick={() => handleRemoveCase(row, c)}
												/>
											</span>
										))}
										{row.testCases.length > 1 && (
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="link"
														size="sm"
														className="cursor-pointer"
													>
														+{row.testCases.length - 1}
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent>
													{row.testCases.map((c) => (
														<div
															key={c}
															className="flex items-center justify-between px-2 py-1 text-sm hover:bg-gray-100"
														>
															<span>{c}</span>
															<X
																className="w-3 h-3 cursor-pointer"
																onClick={() => handleRemoveCase(row, c)}
															/>
														</div>
													))}
												</DropdownMenuContent>
											</DropdownMenu>
										)}
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="secondary"
												className="size-6 cursor-pointer"
											>
												<Plus />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent className="max-h-48 overflow-y-auto w-[220px] space-y-1">
											{(caseByDataType[row.dataType as DataType] || []).map(
												(option) => (
													<DropdownMenuItem
														key={option}
														onClick={() => handleToggleCase(row, option)}
														className={`cursor-pointer ${
															row.testCases.includes(option)
																? "bg-blue-100 font-semibold rounded"
																: ""
														}`}
													>
														{option}
													</DropdownMenuItem>
												)
											)}
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Confirmation Dialog for Data Type Change */}
			{dataTypeChangeInfo && (
				<AlertDialog
					open={isConfirmDialogOpen}
					onOpenChange={(open) => {
						if (!open) {
							// Dialog is closing (e.g. by Cancel, Escape, or clicking outside)
							handleCancelDataTypeChange();
						} else {
							setIsConfirmDialogOpen(true);
						}
					}}
				>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Confirm Data Type Change</AlertDialogTitle>
							<AlertDialogDescription>
								You are about to change the data type for field This action will
								clear all its currently selected test cases. Are you sure you
								want to proceed?
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>{" "}
							{/* Automatically handles onOpenChange(false) */}
							<AlertDialogAction onClick={handleConfirmDataTypeChange}>
								Confirm
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</div>
	);
};
