"use client";
import React, { useState } from "react";

// --- Shadcn UI Imports ---
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
} from "@/components/ui/alert-dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Button } from "../ui/button";

// --- Icons & Utils ---
import { Plus, X, Check } from "lucide-react";
import { useApiBodyStore, ApiBodyRow } from "@/store/body-api-slice";
import { cn } from "@/lib/utils";

// --- Component-specific Data ---
const dataTypeOptions = ["string", "number", "boolean", "date"] as const;
type DataType = (typeof dataTypeOptions)[number];

const caseByDataType: Record<DataType, string[]> = {
	string: [
		"Empty String",
		"Null Value",
		"Length",
		"String Too Long",
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
		newType: DataType;
	} | null>(null);

	if (!apiBodyRows || apiBodyRows.length === 0) {
		return (
			<p className="min-h-[480px] p-4 text-center text-muted-foreground">
				Parse a JSON body to see test cases.
			</p>
		);
	}

	// --- All handler functions remain the same ---
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

	const initiateDataTypeChange = (rowId: string, newType: DataType) => {
		const currentRow = apiBodyRows.find((r) => r.id === rowId);
		if (!currentRow || currentRow.dataType === newType) return;
		if (currentRow.testCases && currentRow.testCases.length > 0) {
			setDataTypeChangeInfo({ rowId, newType });
			setIsConfirmDialogOpen(true);
		} else {
			updateRow(rowId, { dataType: newType, testCases: [] });
		}
	};

	const handleConfirmDataTypeChange = () => {
		if (dataTypeChangeInfo) {
			updateRow(dataTypeChangeInfo.rowId, {
				dataType: dataTypeChangeInfo.newType,
				testCases: [],
			});
		}
		setIsConfirmDialogOpen(false);
		setDataTypeChangeInfo(null);
	};

	const handleCancelDataTypeChange = () => {
		setIsConfirmDialogOpen(false);
		setDataTypeChangeInfo(null);
	};

	return (
		<div className="space-y-5 min-h-[480px]">
			<div className="border border-gray-300 rounded-md overflow-hidden w-full mx-auto">
				<Table className="w-full table-fixed">
					<TableHeader>
						<TableRow>
							{/* FIX: Adjusted column widths for a more balanced layout */}
							<TableHead className="px-4 py-3 font-semibold text-left text-sm text-gray-700 border-r w-[25%]">
								Field
							</TableHead>
							<TableHead className="px-4 py-3 font-semibold text-left text-sm text-gray-700 border-r w-[25%]">
								Value
							</TableHead>
							<TableHead className="px-4 py-3 font-semibold text-left text-sm text-gray-700 border-r w-[15%]">
								Data Type
							</TableHead>
							<TableHead className="px-4 py-3 font-semibold text-left text-sm text-gray-700 w-[25%]">
								Test Case
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{apiBodyRows.map((row) => (
							<TableRow key={row.id} className="hover:bg-gray-50 border-b">
								<TableCell className="py-2 border-r">
									<span className="block px-2 py-1 text-sm font-medium">
										{row.id}
									</span>
								</TableCell>
								<TableCell className="px-4 py-2 border-r">
									<span className="block px-2 py-1 text-sm text-muted-foreground">
										{String(row.value)}
									</span>
								</TableCell>
								<TableCell className="px-4 py-2 border-r">
									<Select
										value={row.dataType}
										onValueChange={(value) =>
											initiateDataTypeChange(row.id, value as DataType)
										}
									>
										<SelectTrigger className="w-full cursor-pointer">
											<SelectValue />
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

								{/* ▼▼▼ UI UPGRADE FOR TEST CASE SELECTION ▼▼▼ */}
								<TableCell className="px-4 py-2">
									<div className="flex items-center gap-2 flex-wrap">
										{row.testCases.slice(0, 1).map((caseName) => (
											<span
												key={caseName}
												className="bg-black text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
											>
												{caseName}
												<X
													className="w-3 h-3 cursor-pointer"
													onClick={() => handleRemoveCase(row, caseName)}
												/>
											</span>
										))}
										{row.testCases.length > 1 && (
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														size="sm"
														variant="ghost"
														className="h-auto p-1 text-xs"
													>
														+ {row.testCases.length - 1} more
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent>
													{row.testCases.slice(1).map((caseName) => (
														<DropdownMenuItem
															key={caseName}
															className="flex justify-between"
															onSelect={(e) => e.preventDefault()}
														>
															{caseName}
															<X
																className="w-3 h-3 cursor-pointer"
																onClick={() => handleRemoveCase(row, caseName)}
															/>
														</DropdownMenuItem>
													))}
												</DropdownMenuContent>
											</DropdownMenu>
										)}
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													size="icon"
													className="h-6 w-6 shrink-0"
												>
													<Plus className="h-4 w-4" />
												</Button>
											</PopoverTrigger>
											<PopoverContent className="p-0 w-[250px]" align="start">
												<Command>
													<CommandInput placeholder="Search cases..." />
													<CommandList>
														<CommandEmpty>
															No cases found for this type.
														</CommandEmpty>
														<CommandGroup>
															{(
																caseByDataType[row.dataType as DataType] || []
															).map((caseName) => (
																<CommandItem
																	key={caseName}
																	value={caseName}
																	onSelect={() =>
																		handleToggleCase(row, caseName)
																	}
																>
																	<Check
																		className={cn(
																			"mr-2 h-4 w-4",
																			row.testCases.includes(caseName)
																				? "opacity-100"
																				: "opacity-0"
																		)}
																	/>
																	{caseName}
																</CommandItem>
															))}
														</CommandGroup>
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>
									</div>
								</TableCell>
								{/* ▲▲▲ END OF UI UPGRADE ▲▲▲ */}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<AlertDialog
				open={isConfirmDialogOpen}
				onOpenChange={setIsConfirmDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Confirm Data Type Change</AlertDialogTitle>
						<AlertDialogDescription>
							Changing the data type will clear all selected test cases for this
							field. Are you sure you want to proceed?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={handleCancelDataTypeChange}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleConfirmDataTypeChange}>
							Confirm
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};
