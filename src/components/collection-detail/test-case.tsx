"use client";
import React, { useState, useEffect } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, X } from "lucide-react";
import { useApiBodyStore, ApiBodyRow } from "@/store/body-api-slice";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { getAllPredefinedAction } from "@/action/pre-defined-action";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Skeleton } from "@/components/ui/skeleton"; // 1. Import Skeleton

interface TestCase {
	type: string;
	case: string;
	value: any;
}

export const TestCase = () => {
	const { apiBodyRows, updateRow } = useApiBodyStore();
	const [testCases, setTestCases] = useState<TestCase[]>([]);
	const [dataTypeOptions, setDataTypeOptions] = useState<string[]>([]);
	const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
	// 2. Add the isLoading state
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchTestCases = async () => {
			setIsLoading(true); // Set loading true at the start of the fetch
			try {
				const backendData = await getAllPredefinedAction();
				if (backendData && Array.isArray(backendData)) {
					const transformedData: TestCase[] = backendData.map((item: any) => ({
						type: item.dataType.name,
						case: item.name,
						value: item.value,
					}));
					setTestCases(transformedData);
					const uniqueTypes = [
						...new Set(transformedData.map((item) => item.type)),
					];
					setDataTypeOptions(uniqueTypes);
				}
			} catch (error) {
				console.error("Failed to fetch test cases:", error);
			} finally {
				// Set loading to false after the fetch is done
				setIsLoading(false);
			}
		};
		fetchTestCases();
	}, []);

	// This message is now shown only after loading is complete and there are no rows
	if (!isLoading && (!apiBodyRows || apiBodyRows.length === 0)) {
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

	const handleChangeDataType = (rowId: string, newType: string) => {
		updateRow(rowId, { dataType: newType, testCases: [] });
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
						{/* 3. Conditionally render Skeletons or the actual Table Rows */}
						{isLoading
							? [...Array(3)].map((_, i) => (
									<TableRow key={i} className="border-b border-gray-200">
										<TableCell className="py-2 border-r border-gray-200">
											<Skeleton className="h-5 w-3/4" />
										</TableCell>
										<TableCell className="px-4 py-2 border-r border-gray-200">
											<Skeleton className="h-5 w-1/2" />
										</TableCell>
										<TableCell className="px-4 py-2 border-r border-gray-200">
											<Skeleton className="h-10 w-[180px]" />
										</TableCell>
										<TableCell className="px-4 py-2 flex items-center justify-start gap-2">
											<Skeleton className="size-6 rounded-md p-1" />
										</TableCell>
									</TableRow>
							  ))
							: apiBodyRows.map((row) => (
									<TableRow
										key={row.id}
										className="hover:bg-gray-50 border-b border-gray-200"
									>
										<TableCell className="py-2 border-r border-gray-200">
											<span className="block px-2 py-1 text-sm">{row.id}</span>
										</TableCell>
										<TableCell className="px-4 py-2 border-r border-gray-200">
											<span className="block px-2 py-1 text-sm">
												{String(row.value)}
											</span>
										</TableCell>
										<TableCell className="px-4 py-2 border-r border-gray-200">
											<Select
												value={row.dataType}
												onValueChange={(value) =>
													handleChangeDataType(row.id, value)
												}
											>
												<SelectTrigger className="w-[180px]">
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
										<TableCell className="px-4 py-2 flex items-center justify-start gap-2">
											<Popover
												open={openPopoverId === row.id}
												onOpenChange={(isOpen) =>
													setOpenPopoverId(isOpen ? row.id : null)
												}
											>
												<PopoverTrigger asChild>
													<Button variant="secondary" className="size-6 p-1">
														<Plus />
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-[300px] p-0" align="end">
													<Command>
														<CommandInput placeholder="Search test case..." />
														<CommandList>
															<CommandEmpty>No test case found.</CommandEmpty>
															<CommandGroup>
																{testCases
																	.filter((tc) => tc.type === row.dataType)
																	.map((testCase) => (
																		<CommandItem
																			key={testCase.case}
																			value={testCase.case}
																			onSelect={() =>
																				handleToggleCase(row, testCase.case)
																			}
																			className={cn(
																				"cursor-pointer",
																				row.testCases.includes(testCase.case) &&
																					"bg-accent text-accent-foreground"
																			)}
																		>
																			{testCase.case}
																		</CommandItem>
																	))}
															</CommandGroup>
														</CommandList>
													</Command>
												</PopoverContent>
											</Popover>
											<div className="flex flex-wrap items-center justify-end gap-2">
												{row.testCases.slice(0, 1).map((c) => (
													<span
														key={c}
														className="bg-black text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 max-w-[120px]"
													>
														<span className="truncate" title={c}>
															{c}
														</span>
														<X
															className="w-3 h-3 cursor-pointer flex-shrink-0"
															onClick={() => handleRemoveCase(row, c)}
														/>
													</span>
												))}
												{row.testCases.length > 1 && (
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="link"
																className="h-auto p-0 text-xs font-semibold"
															>
																+{row.testCases.length - 1}
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent
															align="end"
															className="max-h-48 overflow-y-auto w-[200px]"
														>
															{row.testCases.map((c) => (
																<DropdownMenuItem
																	key={c}
																	className="flex items-center justify-between text-xs"
																	onSelect={(e) => e.preventDefault()}
																>
																	<span className="truncate" title={c}>
																		{c}
																	</span>
																	<X
																		className="w-3 h-3 cursor-pointer text-muted-foreground hover:text-foreground"
																		onClick={() => handleRemoveCase(row, c)}
																	/>
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
		</div>
	);
};
