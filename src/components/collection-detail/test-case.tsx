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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Plus, X } from "lucide-react";
import { useApiBodyStore, ApiBodyRow } from "@/store/body-api-slice";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getCustomTestCaseAction } from "@/action/custom-test-case-action";
import { getAllPredefinedAction } from "@/action/pre-defined-action";
import {
	createRequestTestCaseAction,
	getRequestTestCaseAction,
	deleteRequestTestCaseAction,
} from "@/action/request-action";
import { Application_Context } from "@/types/request-type";
import { EndpointItem } from "@/types";
import { usePathname } from "next/navigation";

// Interfaces are correct
interface ApiTestCaseData {
	id: string;
	name: string;
	value: any;
	dataType: { name: string };
}
interface TestCase {
	id: string;
	type: string;
	case: string;
	value: any;
}
interface SavedRequestTestCase {
	id: string;
	targetFieldPath: string;
	testCase: {
		id: string;
		name: string;
	};
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
	const pathname = usePathname();
	const [savedRequestTestCases, setSavedRequestTestCases] = useState<
		SavedRequestTestCase[]
	>([]);

	useEffect(() => {
		const fetchAndSyncData = async () => {
			setIsLoading(true);
			try {
				const projectId = pathname.split("/")[2];
				const [predefinedData, customData, savedTestCases] = await Promise.all([
					getAllPredefinedAction(),
					getCustomTestCaseAction(projectId || ""),
					getRequestTestCaseAction({ requestId }),
				]);

				if (Array.isArray(savedTestCases)) {
					setSavedRequestTestCases(savedTestCases);
				}

				const transformToTestCase = (item: ApiTestCaseData): TestCase => ({
					id: item.id,
					type: item.dataType.name,
					case: item.name,
					value: item.value,
				});
				const transformedPredefined = Array.isArray(predefinedData)
					? predefinedData.map(transformToTestCase)
					: [];
				const transformedCustom = Array.isArray(customData)
					? customData.map(transformToTestCase)
					: [];
				const allTestCases = [...transformedPredefined, ...transformedCustom];
				setTestCases(allTestCases);

				// This line populates the Data Type dropdown
				const uniqueTypes = [...new Set(allTestCases.map((item) => item.type))];
				setDataTypeOptions(uniqueTypes);

				// ✨ --- This logic now correctly syncs the UI on load --- ✨
				const bodyFieldCases = savedTestCases.filter(
					(tc: any) => tc.applicationContext === Application_Context.BODY_FIELD
				);

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

				// This updates the Zustand store, which makes the UI show the saved test cases
				setApiBodyRows(syncedRows);
			} catch (error) {
				toast.error("Failed to load test case data.");
			} finally {
				setIsLoading(false);
			}
		};

		if (requestId) {
			fetchAndSyncData();
		}
	}, [requestId, pathname, setApiBodyRows]); // A cleaner dependency array

	// All handler functions below are correct and do not need to be changed.
	const handleToggleCase = (row: ApiBodyRow, selectedCaseName: string) => {
		const selectedTestCase = testCases.find((t) => t.case === selectedCaseName);
		if (!selectedTestCase)
			return toast.error(`Details not found for ${selectedCaseName}`);

		const isAlreadySelected = row.testCases.includes(selectedCaseName);
		if (isAlreadySelected) {
			handleRemoveCase(row, selectedCaseName);
		} else {
			startTransition(async () => {
				const result = await createRequestTestCaseAction({
					requestId,
					testCaseId: selectedTestCase.id,
					applicationContext: Application_Context.BODY_FIELD,
					targetFieldPath: row.id,
					isExpectedSuccess: false,
				});

				if (result.success && result.data) {
					const updatedSavedCases = await getRequestTestCaseAction({
						requestId,
					});
					setSavedRequestTestCases(updatedSavedCases);
					const newTestCases = [...row.testCases, selectedCaseName];
					updateRow(row.id, { testCases: newTestCases });
					toast.success("Test case added.");
				} else {
					toast.error("Failed to add test case.");
				}
			});
		}
	};

	const handleRemoveCase = (row: ApiBodyRow, caseNameToRemove: string) => {
		const linkToDelete = savedRequestTestCases.find(
			(rtc) =>
				rtc.targetFieldPath === row.id && rtc.testCase.name === caseNameToRemove
		);

		if (!linkToDelete) {
			toast.error(
				"Could not find the test case to remove. It might be out of sync."
			);
			const newTestCases = row.testCases.filter((c) => c !== caseNameToRemove);
			updateRow(row.id, { testCases: newTestCases });
			return;
		}

		const requestTestCaseIdToRemove = linkToDelete.id;
		const newTestCasesForUI = row.testCases.filter(
			(c) => c !== caseNameToRemove
		);
		updateRow(row.id, { testCases: newTestCasesForUI });

		startTransition(async () => {
			const result = await deleteRequestTestCaseAction(
				requestTestCaseIdToRemove
			);
			if (result.success) {
				toast.success(result.message);
				setSavedRequestTestCases((prev) =>
					prev.filter((rtc) => rtc.id !== requestTestCaseIdToRemove)
				);
			} else {
				toast.error(result.error);
				updateRow(row.id, { testCases: row.testCases });
			}
		});
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

	// JSX is unchanged
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
										<TableCell className="p-4 border-r">
											<Skeleton className="h-5 w-3/4" />
										</TableCell>
										<TableCell className="p-4 border-r">
											<Skeleton className="h-5 w-1/2" />
										</TableCell>
										<TableCell className="p-4 border-r">
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
										<TableCell className="p-4 border-r">
											<span className="block text-sm">{row.id}</span>
										</TableCell>
										<TableCell className="p-4 border-r">
											<span className="block text-sm">{String(row.value)}</span>
										</TableCell>
										<TableCell className="p-4 border-r">
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