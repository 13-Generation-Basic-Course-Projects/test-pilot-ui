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
	updateRequestPathVariablesAction,
	deleteRequestTestCaseAction, // Import the delete action
} from "@/action/request-action";

// Interfaces remain the same
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
	testCase: {
		id: string;
		name: string;
	};
	// Include any other relevant fields from the API response
}

export default function PathVariable({
	request,
	requestId,
}: {
	request: EndpointItem[];
	requestId: string;
}) {
	const { pathVariables, setPathVariables } = useParamsApiStore();
	const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
	const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);
	const [testCases, setTestCases] = useState<TestCase[]>([]);
	const [isSaving, startTransition] = useTransition();
	const pathname = usePathname();

	// ✨ 3. Create a local state to cache the full test case data with IDs
	const [savedPathTestCases, setSavedPathTestCases] = useState<
		SavedRequestTestCase[]
	>([]);

	// This effect for syncing UI state is updated to populate the local cache
	useEffect(() => {
		const fetchData = async () => {
			if (!requestId) {
				setPathVariables([]);
				return;
			}

			const savedTestCases = await getRequestTestCaseAction({ requestId });

			// ✨ 4. Populate our local cache with the full data from the backend
			if (Array.isArray(savedTestCases)) {
				setSavedPathTestCases(savedTestCases);
			}

			const currentEndpoint = request.find((r) => r.id === requestId);
			const pathVariablesObject = (currentEndpoint?.details?.pathVariables ??
				{}) as Record<string, string>;

			const formattedPathVariables: ParamRow[] = Object.entries(
				pathVariablesObject
			).map(([key, value]) => {
				const casesForKey = savedTestCases
					.filter(
						(tc: any) =>
							tc.targetFieldPath === key &&
							tc.applicationContext === Application_Context.PATH_VARIABLE
					)
					.map((tc: any) => tc.testCase.name);
				return { key, value: String(value), cases: casesForKey };
			});
			setPathVariables(formattedPathVariables);
		};

		fetchData();
	}, [requestId, request, setPathVariables]);

	// This effect for fetching available test cases is correct
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
				await updateRequestPathVariablesAction(requestId, payload);
			} catch (error) {
				toast.error("Path variables could not be saved.");
			}
		});
	};

	// ✨ 5. Implement the delete logic in handleRemoveCase using the local cache
	const handleRemoveCase = (index: number, caseNameToRemove: string) => {
		const rowData = pathVariables[index];

		// Find the full saved test case link in our local cache
		const linkToDelete = savedPathTestCases.find(
			(rtc) =>
				rtc.targetFieldPath === rowData.key &&
				rtc.testCase.name === caseNameToRemove
		);

		if (!linkToDelete) {
			toast.error(
				"Could not find the test case to remove. It may be out of sync."
			);
			return;
		}

		const requestTestCaseIdToRemove = linkToDelete.id;

		// Optimistically update the UI
		const updatedRows = [...pathVariables];
		updatedRows[index].cases = updatedRows[index].cases.filter(
			(c) => c !== caseNameToRemove
		);
		setPathVariables(updatedRows);

		// Call the backend to delete the record
		startTransition(async () => {
			const result = await deleteRequestTestCaseAction(
				requestTestCaseIdToRemove
			);
			if (result.success) {
				toast.success(result.message);
				// On success, also remove it from our local cache
				setSavedPathTestCases((prev) =>
					prev.filter((rtc) => rtc.id !== requestTestCaseIdToRemove)
				);
			} else {
				toast.error(result.error);
				// Revert UI on failure
				setPathVariables(pathVariables);
			}
		});
	};

	// ✨ 6. Update handleToggleCase to handle both adding and removing
	const handleToggleCase = (index: number, selectedCase: string) => {
		const rowData = pathVariables[index];
		const isSelected = rowData.cases.includes(selectedCase);

		if (isSelected) {
			// If already selected, trigger the remove logic
			handleRemoveCase(index, selectedCase);
		} else {
			// Otherwise, trigger the add logic
			const testCaseToAdd = testCases.find((t) => t.case === selectedCase);
			if (!testCaseToAdd)
				return toast.error("Could not find test case details.");

			startTransition(async () => {
				const result = await createRequestTestCaseAction({
					requestId,
					testCaseId: testCaseToAdd.id,
					applicationContext: Application_Context.PATH_VARIABLE,
					targetFieldPath: rowData.key,
					isExpectedSuccess: false,
				});

				if (result.success) {
					// Add to UI
					const updatedRows = [...pathVariables];
					updatedRows[index].cases = [
						...updatedRows[index].cases,
						selectedCase,
					];
					setPathVariables(updatedRows);
					// Refresh local cache with the new record from the backend
					const updatedSavedCases = await getRequestTestCaseAction({
						requestId,
					});
					setSavedPathTestCases(updatedSavedCases);

					toast.success("Test case added.");
				} else {
					toast.error(result.error);
				}
			});
		}
	};

	// --- Other handlers ---
	const handleAddRow = () => {
		setPathVariables([...pathVariables, { key: "", value: "", cases: [] }]);
	};
	const handleChange = (
		index: number,
		field: keyof ParamRow,
		newValue: string
	) => {
		const updatedRows = pathVariables.map((row, i) =>
			i === index ? { ...row, [field]: newValue } : row
		);
		setPathVariables(updatedRows);
	};
	const handleDeleteRow = () => {
		if (deleteIndex !== null) {
			const updatedRows = pathVariables.filter((_, i) => i !== deleteIndex);
			setPathVariables(updatedRows);
			handleSave(updatedRows);
			setDeleteIndex(null);
		}
	};

	// ✨ 7. The JSX is already set up correctly to call handleRemoveCase
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
						{pathVariables.map((row, index) => (
							<TableRow key={index} className="hover:bg-gray-50">
								<TableCell className="py-0 px-2 border-r">
									<Input
										value={row.key}
										onChange={(e) => handleChange(index, "key", e.target.value)}
										onBlur={() => handleSave(pathVariables)}
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
										onBlur={() => handleSave(pathVariables)}
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
																	<Button
																		variant="ghost"
																		onClick={() =>
																			handleRemoveCase(index, caseName)
																		}
																		className="w-3 h-3 cursor-pointer text-muted-foreground hover:text-red-500"
																	>
																		<X />
																	</Button>
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
