"use client";

import { useEffect, useState, useTransition } from "react";
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
import { Trash2, Plus, X, Check } from "lucide-react";
import { useParamsApiStore } from "@/store/params-api-slice";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { EndpointItem } from "@/types";
import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { Application_Context } from "@/types/request-type";
import { usePathname } from "next/navigation";

// ✨ 1. Import all necessary actions, including the delete action
import { getAllPredefinedAction } from "@/action/pre-defined-action";
import { getCustomTestCaseAction } from "@/action/custom-test-case-action";
import {
	createRequestTestCaseAction,
	getRequestTestCaseAction,
	updateRequestQueryParamsAction,
	deleteRequestTestCaseAction, // Import delete action
} from "@/action/request-action";

// Interfaces for component state
export interface ParamRow {
	key: string;
	value: string;
	cases: string[];
}
interface TestCase {
	id: string;
	type: string;
	case: string;
	value: any;
}

// ✨ 2. Define an interface for the full saved data we will cache locally
interface SavedRequestTestCase {
	id: string; // The ID of the LINK record we need for deletion
	targetFieldPath: string;
	applicationContext: string;
	testCase: {
		id: string;
		name: string;
	};
}

export default function QueryParams({
	request,
	requestId,
}: {
	request: EndpointItem[];
	requestId: string;
}) {
	const { queryParams, setQueryParams } = useParamsApiStore();
	const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
	const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);
	const [testCases, setTestCases] = useState<TestCase[]>([]);
	const [isSaving, startTransition] = useTransition();
	const pathname = usePathname();

	// ✨ 3. Create a local state to cache the full test case data with IDs
	const [savedQueryTestCases, setSavedQueryTestCases] = useState<
		SavedRequestTestCase[]
	>([]);

	// Effect to sync UI state with saved data from the backend
	useEffect(() => {
		const fetchData = async () => {
			if (!requestId) {
				setQueryParams([]);
				return;
			}

			const savedTestCases = await getRequestTestCaseAction({ requestId });

			// ✨ 4. Populate our local cache with the full data
			if (Array.isArray(savedTestCases)) {
				setSavedQueryTestCases(savedTestCases);
			}

			const currentEndpoint = request.find((r) => r.id === requestId);
			const queryParamsObject = (currentEndpoint?.details?.queryParams ??
				{}) as Record<string, string>;

			const formattedQueryParams: ParamRow[] = Object.entries(
				queryParamsObject
			).map(([key, value]) => {
				const casesForKey = savedTestCases
					.filter(
						(tc: any) =>
							tc.targetFieldPath === key &&
							tc.applicationContext === Application_Context.QUERY_PARAM
					)
					.map((tc: any) => tc.testCase.name);
				return { key, value: String(value), cases: casesForKey };
			});
			setQueryParams(formattedQueryParams);
		};

		fetchData();
	}, [requestId, request, setQueryParams]);

	// Effect to fetch ALL available test cases (predefined + custom)
	useEffect(() => {
		const fetchTestCases = async () => {
			try {
				const projectId = pathname.split("/")[2];
				const [predefinedData, customData] = await Promise.all([
					getAllPredefinedAction(),
					projectId ? getCustomTestCaseAction(projectId) : Promise.resolve([]),
				]);

				const transformToTestCase = (item: any): TestCase => ({
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
			} catch (error) {
				toast.error("Could not load test case data.");
			}
		};
		fetchTestCases();
	}, [pathname]);

	const handleSave = (variablesToSave: ParamRow[]) => {
		const payload = variablesToSave.reduce((acc, row) => {
			if (row.key.trim()) {
				acc[row.key.trim()] = row.value;
			}
			return acc;
		}, {} as Record<string, string>);

		startTransition(async () => {
			try {
				await updateRequestQueryParamsAction(requestId, payload);
			} catch (error) {
				toast.error("Query params could not be saved.");
			}
		});
	};

	// ✨ 5. Implement the delete logic in handleRemoveCase using the local cache
	const handleRemoveCase = (index: number, caseNameToRemove: string) => {
		const rowData = queryParams[index];

		const linkToDelete = savedQueryTestCases.find(
			(rtc) =>
				rtc.applicationContext === Application_Context.QUERY_PARAM &&
				rtc.targetFieldPath === rowData.key &&
				rtc.testCase.name === caseNameToRemove
		);

		if (!linkToDelete) {
			return toast.error(
				"Could not find the test case to remove. It may be out of sync."
			);
		}

		const requestTestCaseIdToRemove = linkToDelete.id;

		const updatedRows = [...queryParams];
		updatedRows[index].cases = updatedRows[index].cases.filter(
			(c) => c !== caseNameToRemove
		);
		setQueryParams(updatedRows);

		startTransition(async () => {
			const result = await deleteRequestTestCaseAction(
				requestTestCaseIdToRemove
			);
			if (result.success) {
				toast.success(result.message);
				setSavedQueryTestCases((prev) =>
					prev.filter((rtc) => rtc.id !== requestTestCaseIdToRemove)
				);
			} else {
				toast.error(result.error);
				setQueryParams(queryParams); // Revert UI on failure
			}
		});
	};

	// ✨ 6. Update handleToggleCase to handle both adding and removing
	const handleToggleCase = (index: number, selectedCase: string) => {
		const rowData = queryParams[index];
		const isSelected = rowData.cases.includes(selectedCase);

		if (isSelected) {
			handleRemoveCase(index, selectedCase);
		} else {
			const testCaseToAdd = testCases.find((t) => t.case === selectedCase);
			if (!testCaseToAdd)
				return toast.error("Could not find test case details.");

			startTransition(async () => {
				const result = await createRequestTestCaseAction({
					requestId,
					testCaseId: testCaseToAdd.id,
					applicationContext: Application_Context.QUERY_PARAM,
					targetFieldPath: rowData.key,
					isExpectedSuccess: false,
				});

				if (result.success) {
					const updatedRows = [...queryParams];
					updatedRows[index].cases.push(selectedCase);
					setQueryParams(updatedRows);

					const updatedSavedCases = await getRequestTestCaseAction({
						requestId,
					});
					setSavedQueryTestCases(updatedSavedCases);
					toast.success("Test case added.");
				} else {
					toast.error(result.error);
				}
			});
		}
	};

	// --- Other handlers ---
	const handleAddRow = () => {
		setQueryParams([...queryParams, { key: "", value: "", cases: [] }]);
	};
	const handleChange = (
		index: number,
		field: keyof ParamRow,
		newValue: string
	) => {
		const updatedRows = queryParams.map((row, i) =>
			i === index ? { ...row, [field]: newValue } : row
		);
		setQueryParams(updatedRows);
	};
	const handleDeleteRow = () => {
		if (deleteIndex !== null) {
			const updatedRows = queryParams.filter((_, i) => i !== deleteIndex);
			setQueryParams(updatedRows);
			handleSave(updatedRows);
			setDeleteIndex(null);
		}
	};

	return (
		<div className="space-y-5">
			<div className="border border-gray-300 rounded-md overflow-hidden w-full mx-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-1/3 px-4">Key</TableHead>
							<TableHead className="w-1/3 px-4">Value</TableHead>
							<TableHead className="px-4">Case</TableHead>
							<TableHead className="w-[50px] px-4">Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{queryParams.map((row, index) => (
							<TableRow key={index} className="hover:bg-gray-50">
								<TableCell className="py-0 px-2 border-r">
									<Input
										value={row.key}
										onChange={(e) => handleChange(index, "key", e.target.value)}
										onBlur={() => handleSave(queryParams)}
										className="h-10 border-transparent focus-visible:ring-1 focus-visible:ring-ring bg-transparent"
										placeholder="Enter key"
									/>
								</TableCell>
								<TableCell className="py-0 px-2 border-r">
									<Input
										value={row.value}
										onChange={(e) =>
											handleChange(index, "value", e.target.value)
										}
										onBlur={() => handleSave(queryParams)}
										className="h-10 border-transparent focus-visible:ring-1 focus-visible:ring-ring bg-transparent"
										placeholder="Enter value"
									/>
								</TableCell>
								<TableCell className="py-2 px-4">
									<div className="flex items-center gap-2 flex-row-reverse justify-end">
										<div className="flex items-center gap-1 py-2">
											<div>
												{row.cases.slice(0, 1).map((c) => (
													<Badge
														key={c}
														className="text-xs px-2 py-1 rounded-full flex items-center gap-1.5"
													>
														{c}{" "}
														<Button
															className="w-3 h-3 cursor-pointer hover:text-red-500"
															onClick={() => handleRemoveCase(index, c)}
														>
															<X />
														</Button>
													</Badge>
												))}
											</div>
											<div>
												{row.cases.length > 1 && (
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																className="h-auto p-1 text-xs text-muted-foreground cursor-pointer"
															>
																+{row.cases.length - 1}
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent>
															{row.cases.slice(1).map((caseName) => (
																<DropdownMenuItem
																	key={caseName}
																	className="flex justify-between items-center"
																	onSelect={(e) => e.preventDefault()}
																>
																	<span>{caseName}</span>
																	<X
																		className="w-4 h-4 p-0.5 rounded-full cursor-pointer text-muted-foreground hover:bg-destructive/20 hover:text-red-500"
																		// ✨ 7. Fix the unclickable 'X' button
																		onClick={(e) => {
																			e.stopPropagation();
																			handleRemoveCase(index, caseName);
																		}}
																	/>
																</DropdownMenuItem>
															))}
														</DropdownMenuContent>
													</DropdownMenu>
												)}
											</div>
										</div>
										<Popover
											open={openPopoverIndex === index}
											onOpenChange={(isOpen) =>
												setOpenPopoverIndex(isOpen ? index : null)
											}
										>
											<PopoverTrigger asChild>
												<Button variant="outline" className="size-6 p-1">
													<Plus className="w-4 h-4" />
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-[300px] p-0">
												<Command>
													<CommandInput placeholder="Search test cases..." />
													<CommandList>
														<CommandEmpty>No results found.</CommandEmpty>
														<CommandGroup>
															{testCases.map((testCase) => (
																<CommandItem
																	key={testCase.id}
																	value={testCase.case}
																	onSelect={() =>
																		handleToggleCase(index, testCase.case)
																	}
																>
																	<Check
																		className={cn(
																			"mr-2 h-4 w-4",
																			row.cases.includes(testCase.case)
																				? "opacity-100"
																				: "opacity-0"
																		)}
																	/>
																	{testCase.case}
																</CommandItem>
															))}
														</CommandGroup>
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>
									</div>
								</TableCell>
								<TableCell className="py-2 px-4 text-center border-l">
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												onClick={() => setDeleteIndex(index)}
												disabled={isSaving}
											>
												<Trash2 className="text-red-500 w-4 h-4" />
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													Are you absolutely sure?
												</AlertDialogTitle>
												<AlertDialogDescription>
													This will permanently delete your variable.
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
							className="cursor-pointer hover:bg-muted/50"
						>
							<TableCell
								colSpan={4}
								className="py-3 px-4 text-sm text-muted-foreground"
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
