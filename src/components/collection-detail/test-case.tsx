"use client";

import React, { useState, useMemo } from "react";

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
import { Plus, X, Check, Loader2 } from "lucide-react";
import { useApiBodyStore, ApiBodyRow } from "@/store/body-api-slice";
import { cn } from "@/lib/utils";

// --- Import the central test case store ---
import useTestCaseStore from "@/store/test-case-store";

// --- Component-specific Data ---
const dataTypeOptions = [
	"string",
	"number",
	"boolean",
	"date",
	"file",
	"uuid",
	"array",
] as const;
type DataType = (typeof dataTypeOptions)[number];

// --- Component Props Interface ---
interface TestCaseProps {
	onTestCasesAdded: () => void;
	isGenerating: boolean;
}

export const TestCase = ({ onTestCasesAdded, isGenerating }: TestCaseProps) => {
	// --- State & Store Hooks ---
	const { apiBodyRows, updateRow } = useApiBodyStore();
	const { predefinedTestCases, customTestCases } = useTestCaseStore();
	const allTestCases = useMemo(
		() => [...predefinedTestCases, ...customTestCases],
		[predefinedTestCases, customTestCases]
	);
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
	const [dataTypeChangeInfo, setDataTypeChangeInfo] = useState<{
		rowId: string;
		newType: DataType;
	} | null>(null);

	// --- Handler Functions ---
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

	const hasSelectedCases = useMemo(
		() => apiBodyRows.some((row) => row.testCases.length > 0),
		[apiBodyRows]
	);

	// --- Render Logic ---
	if (!apiBodyRows || apiBodyRows.length === 0) {
		return (
			<p className="min-h-[480px] p-4 text-center text-muted-foreground">
				Parse a JSON body to see test cases.
			</p>
		);
	}

	return (
		<fieldset disabled={isGenerating} className="space-y-5 min-h-[480px]">
			<div className="flex justify-end pt-4 cursor-pointer">
				<Button
					onClick={onTestCasesAdded}
					disabled={!hasSelectedCases || isGenerating}
					className="text-[15px] cursor-pointer"
				>
					{isGenerating ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Generating...
						</>
					) : (
						"Generate Test Requests"
					)}
				</Button>
			</div>
			<div className="border border-gray-300 rounded-md overflow-hidden w-full mx-auto">
				<Table className="w-full table-fixed">
					<TableHeader>
						<TableRow>
							<TableHead className="px-4 py-3 font-semibold text-left text-[17px] text-gray-700 border-r w-[20%]">
								Field
							</TableHead>
							<TableHead className="px-4 py-3 font-semibold text-left text-[17px] text-gray-700 border-r w-[20%]">
								Value
							</TableHead>
							<TableHead className="px-4 py-3 font-semibold text-left text-[17px] text-gray-700 border-r w-[20%]">
								Data Type
							</TableHead>
							<TableHead className="px-4 py-3 font-semibold text-left text-[17px] text-gray-700 w-[40%]">
								Test Case
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{apiBodyRows.map((row) => (
							<TableRow key={row.id} className="hover:bg-gray-50 border-b">
								<TableCell className="py-2 border-r align-top">
									<span className="block px-2 py-2 text-[16px] font-medium">
										{row.id}
									</span>
								</TableCell>
								<TableCell className="px-4 py-2 border-r align-top">
									<span className="block px-2 py-2 text-[16px] break-all">
										{String(row.value)}
									</span>
								</TableCell>
								<TableCell className="px-4 py-2 border-r align-top">
									<Select
										value={row.dataType}
										onValueChange={(value) =>
											initiateDataTypeChange(row.id, value as DataType)
										}
									>
										<SelectTrigger className="w-full cursor-pointer">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="text-[16px]">
											{dataTypeOptions.map((type) => (
												<SelectItem
													key={type}
													value={type}
													className="text-[16px]"
												>
													{type.charAt(0).toUpperCase() + type.slice(1)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</TableCell>
								<TableCell className="px-4 py-2 align-top">
									<div className="flex items-center gap-2 flex-wrap py-[3px]">
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													size="icon"
													className="h-8 w-8 shrink-0 cursor-pointer"
													onMouseDown={(e) => e.preventDefault()}
												>
													<Plus className="h-6 w-6 size-5" />
												</Button>
											</PopoverTrigger>
											<PopoverContent
												className="p-0 w-[250px]"
												align="start"
												onOpenAutoFocus={(e) => e.preventDefault()}
											>
												<Command>
													<CommandInput placeholder="Search cases..." />
													<CommandList className="overflow-y-auto no-scrollbar">
														<CommandEmpty>No cases found.</CommandEmpty>
														<CommandGroup>
															{allTestCases
																.filter(
																	(testCase) =>
																		testCase.type.toLowerCase() ===
																		row.dataType.toLowerCase()
																)
																.map((testCase) => (
																	<CommandItem
																		key={testCase.name}
																		value={testCase.name}
																		onSelect={(currentValue) => {
																			// ✨ The fix is here! Prevent the default behavior.
																			handleToggleCase(row, testCase.name);
																		}}
																	>
																		<Check
																			className={cn(
																				"mr-2 h-4 w-4",
																				row.testCases.includes(testCase.name)
																					? "opacity-100"
																					: "opacity-0"
																			)}
																		/>
																		{testCase.name}
																	</CommandItem>
																))}
														</CommandGroup>
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>

										{row.testCases.slice(0, 2).map((caseName) => (
											<span
												key={caseName}
												className="bg-black text-white text-[14px] px-2 py-1 rounded-full flex items-center gap-1"
											>
												{caseName}
												<X
													className="w-3 h-3 cursor-pointer"
													onClick={() => handleRemoveCase(row, caseName)}
												/>
											</span>
										))}
										{row.testCases.length > 2 && (
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														size="sm"
														variant="ghost"
														className="h-auto p-1 text-[14px] rounded-full cursor-pointer"
													>
														+ {row.testCases.length - 2}
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent>
													{row.testCases.slice(2).map((caseName) => (
														<DropdownMenuItem
															key={caseName}
															className="flex justify-between items-center cursor-pointer"
															onSelect={(e) => e.preventDefault()} // This is also good practice
														>
															{caseName}
															<button
																className="ml-2 p-0.5 rounded-full hover:bg-gray-200 cursor-pointer"
																onClick={() => handleRemoveCase(row, caseName)}
															>
																<X className="w-3 h-3" />
															</button>
														</DropdownMenuItem>
													))}
												</DropdownMenuContent>
											</DropdownMenu>
										)}
									</div>
								</TableCell>
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
		</fieldset>
	);
};
