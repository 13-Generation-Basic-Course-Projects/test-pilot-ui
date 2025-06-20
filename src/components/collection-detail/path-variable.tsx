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

// ✨ 1. Import all necessary actions, including for custom test cases
import { getAllPredefinedAction } from "@/action/pre-defined-action";
import { getCustomTestCaseAction } from "@/action/custom-test-case-action"; // ✨ Add this
import {
	createRequestTestCaseAction,
	getRequestTestCaseAction,
	updateRequestPathVariablesAction,
} from "@/action/request-action";
import { usePathname } from "next/navigation";

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

	// This effect, for syncing the UI with saved data, is correct and remains unchanged.
	useEffect(() => {
		const fetchData = async () => {
			const testcases = await getRequestTestCaseAction({ requestId });
			const currentEndpoint = request.find((r) => r.id === requestId);
			const pathVariablesObject = (currentEndpoint?.details?.pathVariables ??
				{}) as Record<string, string>;

			const formattedPathVariables: ParamRow[] = Object.entries(
				pathVariablesObject
			).map(([key, value]) => {
				const casesForKey = testcases
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

		if (requestId) {
			fetchData();
		} else {
			setPathVariables([]);
		}
	}, [requestId, request, setPathVariables]);

	const pathname = usePathname();

	// ✨ 2. This is the useEffect hook we will modify to fetch ALL test cases.
	useEffect(() => {
		const fetchTestCases = async () => {
			try {
				// Get the projectId, which is needed to fetch the correct custom test cases.
				const projectId = pathname.split("/")[2];

				// Fetch both predefined and custom test cases in parallel for performance.
				const [predefinedData, customData] = await Promise.all([
					getAllPredefinedAction(),
					// Ensure a projectId exists before trying to fetch custom cases.
					projectId ? getCustomTestCaseAction(projectId) : Promise.resolve([]),
				]);

				// Helper function to transform any test case data into the component's format.
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

				// Combine the two lists into one.
				const allTestCases = [...transformedPredefined, ...transformedCustom];
				setTestCases(allTestCases);
			} catch (error) {
				console.error("Failed to fetch test cases:", error);
				toast.error("Could not load test case data.");
			}
		};

		fetchTestCases();
	}, [request]); // ✨ Depend on `request` to get the projectId

	// --- All handler functions below this point remain the same. ---
	// They will now work with the merged list of test cases automatically.

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
				// toast.success("Path variables saved.");
			} catch (error) {
				toast.error("Path variables could not be saved.");
			}
		});
	};

	const handleAddRow = () => {
		const updatedRows = [...pathVariables, { key: "", value: "", cases: [] }];
		setPathVariables(updatedRows);
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

	const handleRemoveCase = (index: number, caseToRemove: string) => {
		const updatedRows = [...pathVariables];
		updatedRows[index].cases = updatedRows[index].cases.filter(
			(c) => c !== caseToRemove
		);
		setPathVariables(updatedRows);
		// You may want to add a backend call here to remove the test case association.
	};

	const handleToggleCase = (index: number, selectedCase: string) => {
		const updatedRows = [...pathVariables];
		const currentCases = updatedRows[index].cases || [];
		const isSelected = currentCases.includes(selectedCase);

		updatedRows[index].cases = isSelected
			? currentCases.filter((c) => c !== selectedCase)
			: [...currentCases, selectedCase];

		setPathVariables(updatedRows);

		startTransition(async () => {
			try {
				await createRequestTestCaseAction({
					requestId,
					testCaseId: testCases.find((t) => t.case === selectedCase)?.id || "",
					applicationContext: Application_Context.PATH_VARIABLE,
					targetFieldPath: updatedRows[index].key,
					isExpectedSuccess: false,
				});
			} catch (err) {
				toast.error("Failed to save test case.");
			}
		});
	};

	const handleDeleteRow = () => {
		if (deleteIndex !== null) {
			const updatedRows = pathVariables.filter((_, i) => i !== deleteIndex);
			setPathVariables(updatedRows);
			handleSave(updatedRows);
			setDeleteIndex(null);
		}
	};

	// The entire JSX return block is unchanged.
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
														<X
															className="w-3 h-3 cursor-pointer hover:text-red-500"
															onClick={() => handleRemoveCase(index, c)}
														/>
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
																	key={testCase.case}
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
