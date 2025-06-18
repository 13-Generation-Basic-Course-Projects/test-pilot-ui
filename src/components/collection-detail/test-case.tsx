"use client";
import React, { useState, useEffect, useTransition } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
	createRequestTestCaseAction,
	getRequestTestCaseAction,
} from "@/action/request-action";
import { Application_Context } from "@/types/request-type";
import { EndpointItem } from "@/types";
import { toast } from "sonner";

interface TestCase {
	id: string;
	type: string;
	case: string;
	value: any;
}

export const TestCase = ({
	request,
	requestId,
}: {
	request: EndpointItem[];
	requestId: string;
}) => {
	const { apiBodyRows, updateRow, setApiBodyRows } = useApiBodyStore();
	const [testCases, setTestCases] = useState<TestCase[]>([]);
	const [dataTypeOptions, setDataTypeOptions] = useState<string[]>([]);
	const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		const fetchAndSyncData = async () => {
			setIsLoading(true);
			try {
				// Fetch all possible test cases
				const backendData = await getAllPredefinedAction();
				if (backendData && Array.isArray(backendData)) {
					const transformedData: TestCase[] = backendData.map((item: any) => ({
						id: item.id,
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

				if (apiBodyRows.length === 0) {
					setIsLoading(false);
					return;
				}

				// Fetch previously saved test cases for this request
				const savedTestCases = await getRequestTestCaseAction({ requestId });
				console.log("saveTestCase", savedTestCases);
				const bodyFieldCases = savedTestCases.filter(
					(tc: any) =>
						tc.applicationContext === Application_Context.BODY_FIELD &&
						tc.targetFieldPath
				);

				console.log(bodyFieldCases);

				const casesByField = bodyFieldCases.reduce<Record<string, string[]>>(
					(acc, savedCase: any) => {
						const field = savedCase.targetFieldPath;
						const caseName = savedCase.testCase.name;
						if (!acc[field]) acc[field] = [];
						acc[field].push(caseName);
						return acc;
					},
					{}
				);

				const syncedRows = apiBodyRows.map((row) => ({
					...row,
					testCases: casesByField[row.id] || [],
				}));

				if (JSON.stringify(syncedRows) !== JSON.stringify(apiBodyRows)) {
					setApiBodyRows(syncedRows);
				}
			} catch (error) {
				console.error("Failed to fetch or sync test cases:", error);
				toast.error("Failed to load test case data.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchAndSyncData();
	}, [requestId, apiBodyRows.length, setApiBodyRows]);

	const handleToggleCase = (row: ApiBodyRow, selectedCaseName: string) => {
		// --- THIS IS THE FIX ---
		// 1. Find the full test case object ONCE at the beginning.
		const selectedTestCase = testCases.find((t) => t.case === selectedCaseName);

		// 2. Guard Clause: If we can't find the test case, stop immediately.
		if (!selectedTestCase) {
			toast.error(`Could not find details for test case: ${selectedCaseName}`);
			return;
		}

		const newTestCases = row.testCases.includes(selectedCaseName)
			? row.testCases.filter((c) => c !== selectedCaseName)
			: [...row.testCases, selectedCaseName];

		// Update the UI immediately for a responsive feel
		updateRow(row.id, { testCases: newTestCases });

		// 3. Perform the backend action inside a transition.
		startTransition(async () => {
			try {
				await createRequestTestCaseAction({
					requestId,
					testCaseId: selectedTestCase.id, // Use the ID from the object we found
					applicationContext: Application_Context.BODY_FIELD,
					targetFieldPath: row.id,
					isExpectedSuccess: false,
				});
				// Optionally show a success toast here if you want confirmation
				// toast.success(`Test case for '${row.id}' updated.`);
			} catch (err) {
				toast.error(`Failed to save test case for '${row.id}'.`);
				// Optional: Revert the UI state on failure
				updateRow(row.id, { testCases: row.testCases });
			}
		});
	};

	const handleRemoveCase = (row: ApiBodyRow, caseToRemove: string) => {
		const newTestCases = row.testCases.filter((c) => c !== caseToRemove);
		updateRow(row.id, { testCases: newTestCases });
		// Here you would also add a call to a backend action to DELETE the test case.
	};

	const handleChangeDataType = (rowId: string, newType: string) => {
		updateRow(rowId, { dataType: newType, testCases: [] });
	};

	if (!isLoading && (!apiBodyRows || apiBodyRows.length === 0)) {
		return (
			<div className="flex items-center justify-center p-4 text-center text-muted-foreground min-h-[480px]">
				Parse a JSON body to see test cases.
			</div>
		);
	}

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
						{isLoading
							? [...Array(3)].map((_, i) => (
									<TableRow key={i} className="border-b border-gray-200">
										<TableCell className="p-4 border-r border-gray-200">
											<Skeleton className="h-5 w-3/4" />
										</TableCell>
										<TableCell className="p-4 border-r border-gray-200">
											<Skeleton className="h-5 w-1/2" />
										</TableCell>
										<TableCell className="p-4 border-r border-gray-200">
											<Skeleton className="h-10 w-[180px]" />
										</TableCell>
										<TableCell className="p-4 flex items-center justify-start gap-2">
											<Skeleton className="size-8 rounded-md" />
										</TableCell>
									</TableRow>
							  ))
							: apiBodyRows.map((row) => (
									<TableRow
										key={row.id}
										className="hover:bg-gray-50 border-b border-gray-200"
									>
										<TableCell className="p-4 border-r border-gray-200">
											<span className="block text-sm">{row.id}</span>
										</TableCell>
										<TableCell className="p-4 border-r border-gray-200">
											<span className="block text-sm">{String(row.value)}</span>
										</TableCell>
										<TableCell className="p-4 border-r border-gray-200">
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
										<TableCell className="p-4 flex items-center justify-start gap-2 flex-wrap">
											{row.testCases.map((c) => (
												<span
													key={c}
													className="bg-gray-800 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5"
												>
													<span className="truncate" title={c}>
														{c}
													</span>
													<X
														className="w-3 h-3 cursor-pointer flex-shrink-0 hover:text-red-400"
														onClick={() => handleRemoveCase(row, c)}
													/>
												</span>
											))}
											<Popover
												open={openPopoverId === row.id}
												onOpenChange={(isOpen) =>
													setOpenPopoverId(isOpen ? row.id : null)
												}
											>
												<PopoverTrigger asChild>
													<Button variant="outline" className="size-7 p-1">
														<Plus className="w-4 h-4" />
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-[300px] p-0" align="start">
													<Command>
														<CommandInput placeholder="Search test case..." />
														<CommandList>
															<CommandEmpty>No test case found.</CommandEmpty>
															<CommandGroup>
																{testCases
																	.filter(
																		(tc) =>
																			tc.type.toLowerCase() ===
																			row.dataType.toLowerCase()
																	)
																	.map((testCase) => (
																		<CommandItem
																			key={testCase.id}
																			value={testCase.case}
																			onSelect={() => {
																				handleToggleCase(row, testCase.case);
																				setOpenPopoverId(null);
																			}}
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
										</TableCell>
									</TableRow>
							  ))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};
