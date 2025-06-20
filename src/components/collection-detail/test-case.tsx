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
// ✨ WORKAROUND 1: Import the new delete action
import {
	createRequestTestCaseAction,
	getRequestTestCaseAction,
	deleteRequestTestCaseAction,
} from "@/action/request-action";
import { Application_Context } from "@/types/request-type";
import { EndpointItem } from "@/types";
import { usePathname } from "next/navigation";

// These interfaces are correct and do not need to change
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

// ✨ WORKAROUND 2: Define an interface for the full saved data we will cache locally
interface SavedRequestTestCase {
	id: string; // The ID of the LINK record we need for deletion
	targetFieldPath: string;
	testCase: {
		id: string;
		name: string;
	};
	// Include any other fields that come from the API
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

	// ✨ WORKAROUND 3: Create a local state to cache the full test case data with IDs
	const [savedRequestTestCases, setSavedRequestTestCases] = useState<
		SavedRequestTestCase[]
	>([]);

	useEffect(() => {
		const fetchAndSyncData = async () => {
			setIsLoading(true);
			try {
				// ... fetching logic is correct ...
				const projectId = pathname.split("/")[2];
				const [predefinedData, customData, savedTestCases] = await Promise.all([
					getAllPredefinedAction(),
					getCustomTestCaseAction(projectId || ""),
					getRequestTestCaseAction({ requestId }),
				]);

				if (Array.isArray(savedTestCases)) {
					setSavedRequestTestCases(savedTestCases);
				}

				// This logic for available test cases is correct
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

				// ✨ FIX: THIS LINE WAS MISSING. It restores your data type options.
				const uniqueTypes = [...new Set(allTestCases.map((item) => item.type))];
				setDataTypeOptions(uniqueTypes);

				// ... the rest of the sync logic is correct ...
				const bodyFieldCases = savedTestCases.filter(
					(tc: any) => tc.applicationContext === Application_Context.BODY_FIELD
				);
				// ... etc. ...
			} catch (error) {
				toast.error("Failed to load test case data.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchAndSyncData();
		// Also, the dependency array should include `pathname` since it's used inside
	}, [requestId, apiBodyRows.length, pathname]);

	// handleToggleCase for adding a test case remains largely the same
	const handleToggleCase = (row: ApiBodyRow, selectedCaseName: string) => {
		// ... (This function as you have it is mostly for adding, which is fine)
		const selectedTestCase = testCases.find((t) => t.case === selectedCaseName);
		if (!selectedTestCase)
			return toast.error(`Details not found for ${selectedCaseName}`);

		const isAlreadySelected = row.testCases.includes(selectedCaseName);
		if (isAlreadySelected) {
			// If already selected, call the remove handler
			handleRemoveCase(row, selectedCaseName);
		} else {
			// Add logic remains the same
			startTransition(async () => {
				const result = await createRequestTestCaseAction({
					requestId,
					testCaseId: selectedTestCase.id,
					applicationContext: Application_Context.BODY_FIELD,
					targetFieldPath: row.id,
					isExpectedSuccess: false,
				});

				if (result.success && result.data) {
					// Refresh data from backend to get the new ID in our cache
					const updatedSavedCases = await getRequestTestCaseAction({
						requestId,
					});
					setSavedRequestTestCases(updatedSavedCases);
					// Update UI
					const newTestCases = [...row.testCases, selectedCaseName];
					updateRow(row.id, { testCases: newTestCases });
					toast.success("Test case added.");
				} else {
					toast.error("Failed to add test case.");
				}
			});
		}
	};

	// ✨ WORKAROUND 5: Implement the delete logic using the local cache
	const handleRemoveCase = (row: ApiBodyRow, caseNameToRemove: string) => {
		// Find the full saved test case link in our local cache
		const linkToDelete = savedRequestTestCases.find(
			(rtc) =>
				rtc.targetFieldPath === row.id && rtc.testCase.name === caseNameToRemove
		);

		if (!linkToDelete) {
			toast.error(
				"Could not find the test case to remove. It might be out of sync."
			);
			// As a fallback, just remove from UI
			const newTestCases = row.testCases.filter((c) => c !== caseNameToRemove);
			updateRow(row.id, { testCases: newTestCases });
			return;
		}

		const requestTestCaseIdToRemove = linkToDelete.id;

		// Optimistically update the UI
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
				// On success, also remove it from our local cache to keep it in sync
				setSavedRequestTestCases((prev) =>
					prev.filter((rtc) => rtc.id !== requestTestCaseIdToRemove)
				);
			} else {
				// If it fails, revert the UI change and show an error
				toast.error(result.error);
				updateRow(row.id, { testCases: row.testCases });
			}
		});
	};

	// ... rest of the component is unchanged
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
			{/* The entire JSX Table remains the same as it correctly uses handleRemoveCase */}
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
