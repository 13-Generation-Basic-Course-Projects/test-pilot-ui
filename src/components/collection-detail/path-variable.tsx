"use client";
import { useEffect, useState } from "react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

import { Trash2, Plus, X } from "lucide-react";
import { useParamsApiStore } from "@/store/params-api-slice";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { getAllPredefinedAction } from "@/action/pre-defined-action"; // 1. Import your action

export interface ParamRow {
	key: string;
	value: string;
	cases: string[];
}

// 2. Define an interface for the test case data
interface TestCase {
	type: string;
	case: string;
	value: any;
}

// The hardcoded `testCases` is no longer needed.
// const testCases = [ ... ];

export default function PathVariable() {
	const { pathVariables, setPathVariables } = useParamsApiStore();
	const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
	const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);

	// 3. Add state to hold the test cases from the backend
	const [testCases, setTestCases] = useState<TestCase[]>([]);

	// 4. Fetch and set the test cases when the component mounts
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
	}, []); // Empty dependency array ensures this runs only once

	const handleAddRow = () => {
		setPathVariables([...pathVariables, { key: "", value: "", cases: [] }]);
	};

	const handleChange = (
		index: number,
		field: keyof ParamRow,
		newValue: string | string[]
	) => {
		const updatedRows = [...pathVariables];
		updatedRows[index][field] = newValue as never;
		setPathVariables(updatedRows);
	};

	const handleToggleCase = (index: number, selectedCase: string) => {
		const updatedRows = [...pathVariables];
		const currentCases = updatedRows[index].cases;

		const exists = currentCases.includes(selectedCase);
		updatedRows[index].cases = exists
			? currentCases.filter((c) => c !== selectedCase)
			: [...currentCases, selectedCase];
		setPathVariables(updatedRows);
	};

	const handleRemoveCase = (index: number, caseToRemove: string) => {
		const updatedRows = [...pathVariables];
		updatedRows[index].cases = updatedRows[index].cases.filter(
			(c) => c !== caseToRemove
		);
		setPathVariables(updatedRows);
	};

	const handleDeleteRow = () => {
		if (deleteIndex !== null) {
			setPathVariables(pathVariables.filter((_, i) => i !== deleteIndex));
			setDeleteIndex(null);
		}
	};

	return (
		<div className="space-y-5">
			<div className="border border-gray-300 rounded-md overflow-hidden w-full m mx-auto">
				<Table className="w-full">
					<TableHeader>
						<TableRow>
							<TableHead className="px-4 py-3 font-semibold text-left text-sm text-gray-700 border-r border-gray-300">
								Key
							</TableHead>
							<TableHead className="px-4 py-3 font-semibold text-left text-sm text-gray-700 border-r border-gray-300">
								Value
							</TableHead>
							<TableHead className="px-4 py-3 font-semibold text-left text-sm text-gray-700 border-r border-gray-300">
								Case
							</TableHead>
							<TableHead className="px-4 py-3 font-semibold text-left text-sm text-gray-700">
								Action
							</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{pathVariables.map((row, index) => (
							<TableRow
								key={index}
								className="hover:bg-gray-50 border-b border-gray-200"
							>
								{/* Key Input */}
								<TableCell className="py-2 border-r border-gray-200">
									<input
										type="text"
										value={row.key}
										onChange={(e) => handleChange(index, "key", e.target.value)}
										className="w-full px-2 py-1 text-sm border border-transparent focus:outline-none focus:border-gray-300 bg-transparent"
										placeholder="Enter key"
									/>
								</TableCell>

								{/* Value Input */}
								<TableCell className="px-4 py-2 border-r border-gray-200">
									<input
										type="text"
										value={row.value}
										onChange={(e) =>
											handleChange(index, "value", e.target.value)
										}
										className="w-full px-2 py-1 text-sm border border-transparent focus:outline-none focus:border-gray-300 bg-transparent"
										placeholder="Enter value"
									/>
								</TableCell>

								{/* Case Selection */}
								<TableCell className="border-r border-gray-200 flex h-full flex-row-reverse items-center justify-end gap-4">
									<div className="flex flex-wrap items-center h-full py-2">
										{row.cases.slice(0, 1).map((c, i) => (
											<span
												key={i}
												className="bg-black text-white text-xs pl-2 pr-1 py-1 rounded-full flex items-center gap-1 max-w-[120px]"
											>
												<span className="truncate" title={c}>
													{c}
												</span>
												<X
													className="w-3 h-3 cursor-pointer flex-shrink-0"
													onClick={() => handleRemoveCase(index, c)}
												/>
											</span>
										))}
										{row.cases.length > 1 && (
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														className="cursor-pointer size-3"
														variant="link"
													>
														+{row.cases.length - 1}
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent className="max-h-48 overflow-y-auto w-[200px] space-y-3">
													{row.cases.map((c, i) => (
														<div
															key={i}
															className="flex items-center justify-between px-2 py-1 text-sm hover:bg-gray-100"
														>
															<span>{c}</span>
															<X
																className="w-3 h-3 cursor-pointer"
																onClick={() => handleRemoveCase(index, c)}
															/>
														</div>
													))}
												</DropdownMenuContent>
											</DropdownMenu>
										)}
									</div>

									{/* Searchable Popover for adding cases */}
									<div className="py-2">
										<Popover
											open={openPopoverIndex === index}
											onOpenChange={(isOpen) =>
												setOpenPopoverIndex(isOpen ? index : null)
											}
										>
											<PopoverTrigger asChild>
												<Button variant="secondary" className="size-6 p-1">
													<Plus />
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-[400px] p-0" align="end">
												<Command>
													<CommandInput placeholder="Search test case..." />
													<CommandList>
														<CommandEmpty>No test case found.</CommandEmpty>
														<CommandGroup>
															{/* 5. Map over the testCases from state */}
															{testCases.map((testCase) => (
																<CommandItem
																	key={`${testCase.type}-${testCase.case}`}
																	value={testCase.case}
																	onSelect={() => {
																		handleToggleCase(index, testCase.case);
																	}}
																	className={cn(
																		"cursor-pointer my-2",
																		row.cases.includes(testCase.case) &&
																			"bg-accent text-accent-foreground"
																	)}
																>
																	<div>
																		<p>{testCase.case}</p>
																		<p className="text-xs text-muted-foreground">
																			{testCase.type}
																		</p>
																	</div>
																</CommandItem>
															))}
														</CommandGroup>
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>
									</div>
								</TableCell>

								{/* Action Button */}
								<TableCell className="px-4 py-2">
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button
												variant="ghost"
												className="flex justify-center items-center"
												onClick={() => setDeleteIndex(index)}
											>
												<Trash2
													className="text-[#E2001A] cursor-pointer"
													width={20}
												/>
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													Are you absolutely sure?
												</AlertDialogTitle>
												<AlertDialogDescription>
													This action cannot be undone. This will permanently
													delete your variable.
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
							className="cursor-pointer border-t border-gray-200"
						>
							<TableCell
								colSpan={4}
								className="px-4 py-3 text-sm text-gray-500"
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
