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

// NEW: Import your custom test case action
import { getCustomTestCaseAction } from "@/action/custom-test-case-action";
import { getAllPredefinedAction } from "@/action/pre-defined-action";
import {
	createRequestTestCaseAction,
	getRequestTestCaseAction,
} from "@/action/request-action";
import { Application_Context } from "@/types/request-type";
import { EndpointItem } from "@/types";
import { usePathname } from "next/navigation";

// NEW: A consistent type for data coming from both predefined and custom actions
interface ApiTestCaseData {
	id: string;
	name: string;
	value: any;
	dataType: {
		name: string;
	};
}

// The internal representation of a test case in this component
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

	const pathname = usePathname();

	useEffect(() => {
		const fetchAndSyncData = async () => {
			setIsLoading(true);
			try {
				// NEW: Fetch both predefined and custom test cases in parallel
				// NOTE: This assumes you can get a `projectId`. You must pass this to your component
				// or find a way to derive it. Here, we try to get it from the `request` prop.
				const projectId = pathname.split("/")[2];

				if (!projectId) {
					console.error(
						"Project ID is missing, cannot load custom test cases."
					);
					// We can continue with just predefined cases if we want, or stop.
					// For this example, we'll try to fetch custom with an empty string,
					// but a real implementation should handle this more gracefully.
				}

				const [predefinedData, customData] = await Promise.all([
					getAllPredefinedAction(),
					getCustomTestCaseAction(projectId || ""), // Use the found projectId
				]);

				// NEW: Helper function to prevent repeating the transformation logic
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

				// NEW: Combine both lists into one single source of truth for the popover
				const allTestCases = [...transformedPredefined, ...transformedCustom];
				setTestCases(allTestCases);

				// This part now works on the merged data, creating a full list of data types
				const uniqueTypes = [...new Set(allTestCases.map((item) => item.type))];
				setDataTypeOptions(uniqueTypes);

				// --- This section for syncing SAVED cases remains the same ---
				if (apiBodyRows.length === 0) {
					setIsLoading(false);
					return;
				}

				const savedTestCases = await getRequestTestCaseAction({ requestId });
				const bodyFieldCases = savedTestCases.filter(
					(tc: any) =>
						tc.applicationContext === Application_Context.BODY_FIELD &&
						tc.targetFieldPath
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
	}, [requestId, apiBodyRows.length, setApiBodyRows, request]); // NEW: Added `request` to dependency array

	const handleToggleCase = (row: ApiBodyRow, selectedCaseName: string) => {
		const selectedTestCase = testCases.find((t) => t.case === selectedCaseName);
		if (!selectedTestCase) {
			toast.error(`Could not find details for test case: ${selectedCaseName}`);
			return;
		}

		const newTestCases = row.testCases.includes(selectedCaseName)
			? row.testCases.filter((c) => c !== selectedCaseName)
			: [...row.testCases, selectedCaseName];

		updateRow(row.id, { testCases: newTestCases });

		startTransition(async () => {
			try {
				await createRequestTestCaseAction({
					requestId,
					testCaseId: selectedTestCase.id,
					applicationContext: Application_Context.BODY_FIELD,
					targetFieldPath: row.id,
					isExpectedSuccess: false, // You might want to make this dynamic
				});
			} catch (err) {
				toast.error(`Failed to save test case for '${row.id}'.`);
				// Revert the UI state on failure
				updateRow(row.id, { testCases: row.testCases });
			}
		});
	};

	const handleRemoveCase = (row: ApiBodyRow, caseToRemove: string) => {
		const newTestCases = row.testCases.filter((c) => c !== caseToRemove);
		updateRow(row.id, { testCases: newTestCases });
		// You would also add a call to a backend action to DELETE the test case linkage.
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
