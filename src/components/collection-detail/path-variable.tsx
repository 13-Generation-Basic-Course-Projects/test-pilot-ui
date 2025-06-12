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
import { getAllPredefinedAction } from "@/action/pre-defined-action";
import { Input } from "../ui/input";
import { EndpointItem } from "@/types";
import { toast } from "sonner";
// ✨ 1. Import the server action for saving
import { updateRequestPathVariablesAction } from "@/action/request-action";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";

export interface ParamRow {
	key: string;
	value: string;
	cases: string[];
}

interface TestCase {
	type: string;
	case: string;
	value: any;
}

// ✨ 2. The component accepts `requestId` to know which request it's editing
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

	// ✨ 3. This effect synchronizes the UI state with the selected request from props
	useEffect(() => {
		const currentEndpoint = request.find((r) => r.id === requestId);
		// Safely access pathVariables from the endpoint, defaulting to an empty object
		const pathVariablesObject = currentEndpoint?.details?.pathVariables ?? {};

		// Transform the object { key: value } from the backend into the array format [{ key, value, cases }] the UI needs
		const formattedPathVariables: ParamRow[] = Object.entries(
			pathVariablesObject
		).map(([key, value]) => ({
			key,
			value: String(value),
			cases: [], // You can enhance this later to also load cases from your details object if they are saved
		}));

		// Update the global store, which in turn updates this component's display
		setPathVariables(formattedPathVariables);
	}, [requestId, request, setPathVariables]);

	const handleRemoveCase = (index: number, caseToRemove: string) => {
		// 1. Create a shallow copy of your variables array to avoid mutating state directly.
		const updatedRows = [...pathVariables];

		// 2. Use .filter() to create a NEW array of cases, excluding the one to be removed.
		updatedRows[index].cases = updatedRows[index].cases.filter(
			(c) => c !== caseToRemove
		);

		// 3. Update the component's state to reflect the change on the screen.
		setPathVariables(updatedRows);

		// 4. Call handleSave to persist this new state to your backend.
		// handleSave(updatedRows);
	};

	// This effect fetches predefined test cases and is unchanged
	useEffect(() => {
		const fetchTestCases = async () => {
			const backendData = await getAllPredefinedAction();
			if (backendData && Array.isArray(backendData)) {
				const transformedData: TestCase[] = backendData.map((item: any) => ({
					type: item.dataType.name,
					case: item.name,
					value: item.value,
				}));
				setTestCases(transformedData);
			}
		};
		fetchTestCases();
	}, []);

	// ✨ 4. A single, explicit save handler function
	const handleSave = (variablesToSave: ParamRow[]) => {
		// Transform the UI's array state back into the simple { key: value } object the backend expects
		const payload = variablesToSave.reduce((acc, row) => {
			if (row.key.trim()) {
				// Only include rows that have a key
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
		// handleSave(updatedRows); // Save immediately
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
		// We save on blur, not on every keystroke, for a better experience
	};

	const handleToggleCase = (index: number, selectedCase: string) => {
		const updatedRows = [...pathVariables];
		const currentCases = updatedRows[index].cases || [];
		const isSelected = currentCases.includes(selectedCase);

		updatedRows[index].cases = isSelected
			? currentCases.filter((c) => c !== selectedCase)
			: [...currentCases, selectedCase];

		setPathVariables(updatedRows);
		// Saving on case toggle is optional, but can be added here if needed:
		// handleSave(updatedRows);
	};

	const handleDeleteRow = () => {
		if (deleteIndex !== null) {
			const updatedRows = pathVariables.filter((_, i) => i !== deleteIndex);
			setPathVariables(updatedRows);
			handleSave(updatedRows); // Save immediately
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
						{pathVariables.map((row, index) => (
							<TableRow key={index} className="hover:bg-gray-50">
								<TableCell className="py-0 px-2 border-r">
									<Input
										value={row.key}
										onChange={(e) => handleChange(index, "key", e.target.value)}
										onBlur={() => handleSave(pathVariables)}
										className="h-10 border-transparent focus-visible:ring-1 focus-visible:ring-ring bg-transparent"
										placeholder="Enter key"
										// disabled={isSaving}
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
										// disabled={isSaving}
									/>
								</TableCell>
								{/* ✨ FULL CASE SELECTION UI */}
								<TableCell className="py-2 px-4">
									<div className="flex items-center gap-2 flex-row-reverse justify-end">
										{/* Display selected cases as pills */}
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
										{/* Popover to add new cases */}
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
								{/* Delete Action Cell */}
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
			{/* {isSaving && (
				<p className="text-xs text-muted-foreground animate-pulse">Saving...</p>
			)} */}
		</div>
	);
}
