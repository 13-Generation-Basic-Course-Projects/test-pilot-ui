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

// ✨ 1. Import all necessary actions
import { getAllPredefinedAction } from "@/action/pre-defined-action";
import { getCustomTestCaseAction } from "@/action/custom-test-case-action";
import {
	createRequestTestCaseAction,
	getRequestTestCaseAction,
	updateRequestQueryParamsAction, // ✨ Use the new action
} from "@/action/request-action";

// Interfaces are the same, but add 'id' to TestCase for consistency
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
	const [isSaving, startTransition] = useTransition(); // ✨ Add useTransition for loading states
	const pathname = usePathname(); // ✨ Add usePathname to get project ID

	// ✨ 2. Add useEffect to sync UI state with saved data from the backend
	useEffect(() => {
		const fetchData = async () => {
			const testcases = await getRequestTestCaseAction({ requestId });
			const currentEndpoint = request.find((r) => r.id === requestId);
			// Use queryParams from the endpoint details
			const queryParamsObject = (currentEndpoint?.details?.queryParams ??
				{}) as Record<string, string>;

			const formattedQueryParams: ParamRow[] = Object.entries(
				queryParamsObject
			).map(([key, value]) => {
				// Filter for test cases that are for QUERY_PARAM context
				const casesForKey = testcases
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

		if (requestId) {
			fetchData();
		} else {
			setQueryParams([]);
		}
	}, [requestId, request, setQueryParams]);

	// ✨ 3. Add useEffect to fetch ALL available test cases (predefined + custom)
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
	}, [pathname]); // Depend on pathname to get the correct projectId

	// ✨ 4. Add a robust handleSave function
	const handleSave = (variablesToSave: ParamRow[]) => {
		const payload = variablesToSave.reduce((acc, row) => {
			if (row.key.trim()) {
				acc[row.key.trim()] = row.value;
			}
			return acc;
		}, {} as Record<string, string>);

		startTransition(async () => {
			try {
				// Use the new action for query params
				await updateRequestQueryParamsAction(requestId, payload);
			} catch (error) {
				toast.error("Query params could not be saved.");
			}
		});
	};

	// ✨ 5. Upgrade all handlers to be robust and call server actions
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
		// Saving is handled onBlur
	};

	const handleRemoveCase = (index: number, caseToRemove: string) => {
		const updatedRows = [...queryParams];
		updatedRows[index].cases = updatedRows[index].cases.filter(
			(c) => c !== caseToRemove
		);
		setQueryParams(updatedRows);
		// Here you would call a DELETE action for the test case association
	};

	const handleToggleCase = (index: number, selectedCase: string) => {
		const updatedRows = [...queryParams];
		const currentCases = updatedRows[index].cases || [];
		const isSelected = currentCases.includes(selectedCase);

		updatedRows[index].cases = isSelected
			? currentCases.filter((c) => c !== selectedCase)
			: [...currentCases, selectedCase];

		setQueryParams(updatedRows);

		startTransition(async () => {
			try {
				await createRequestTestCaseAction({
					requestId,
					testCaseId: testCases.find((t) => t.case === selectedCase)?.id || "",
					applicationContext: Application_Context.QUERY_PARAM, // Correct context
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
			const updatedRows = queryParams.filter((_, i) => i !== deleteIndex);
			setQueryParams(updatedRows);
			handleSave(updatedRows); // Save after deleting a row
			setDeleteIndex(null);
		}
	};

	// The JSX is updated to match PathVariable's functionality
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
										onBlur={() => handleSave(queryParams)} // ✨ Save on blur
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
										onBlur={() => handleSave(queryParams)} // ✨ Save on blur
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
