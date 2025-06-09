"use client";
import { useState } from "react";

// Shadcn UI Components
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

// Icons & Utils
import { Trash2, Plus, X, Check } from "lucide-react";
import { useParamsApiStore } from "@/store/params-api-slice";
import { cn } from "@/lib/utils";
import { ALL_TEST_CASES } from "@/lib/constants";

export interface ParamRow {
	key: string;
	value: string;
	cases: string[];
}

export default function PathVariable() {
	const { pathVariables, setPathVariables } = useParamsApiStore();
	const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

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

	const handleToggleCase = (index: number, caseName: string) => {
		const updatedRows = [...pathVariables];
		const currentCases = updatedRows[index].cases;
		const exists = currentCases.includes(caseName);
		updatedRows[index].cases = exists
			? currentCases.filter((c) => c !== caseName)
			: [...currentCases, caseName];
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
				{/* FIX 2: Added `table-fixed` to better control column widths */}
				<Table className="w-full table-fixed">
					<TableHeader>
						<TableRow>
							<TableHead className="px-4 py-3 font-semibold text-left text-sm text-gray-700 border-r border-gray-300 w-[30%]">
								Key
							</TableHead>
							<TableHead className="px-4 py-3 font-semibold text-left text-sm text-gray-700 border-r border-gray-300 w-[30%]">
								Value
							</TableHead>
							<TableHead className="px-4 py-3 font-semibold text-left text-sm text-gray-700 border-r border-gray-300 w-[30%]">
								Case
							</TableHead>
							<TableHead className="px-4 py-3 font-semibold text-center text-sm text-gray-700 w-[10%]">
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
								<TableCell className="py-2 border-r border-gray-200">
									<input
										type="text"
										value={row.key}
										onChange={(e) => handleChange(index, "key", e.target.value)}
										className="w-full px-2 py-1 text-sm bg-transparent border border-transparent focus:outline-none focus:border-gray-300"
										placeholder="Enter key"
									/>
								</TableCell>
								<TableCell className="px-4 py-2 border-r border-gray-200">
									<input
										type="text"
										value={row.value}
										onChange={(e) =>
											handleChange(index, "value", e.target.value)
										}
										className="w-full px-2 py-1 text-sm bg-transparent border border-transparent focus:outline-none focus:border-gray-300"
										placeholder="Enter value"
									/>
								</TableCell>
								<TableCell className="px-4 py-2 border-r border-gray-200">
									<div className="flex items-center gap-2 flex-wrap">
										{row.cases.slice(0, 1).map((caseName) => (
											<span
												key={caseName}
												className="bg-black text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
											>
												{caseName}
												<X
													className="w-3 h-3 cursor-pointer"
													onClick={() => handleRemoveCase(index, caseName)}
												/>
											</span>
										))}
										{row.cases.length > 1 && (
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														size="sm"
														variant="ghost"
														className="h-auto p-1 text-xs cursor-pointer"
													>
														+ {row.cases.length - 1}
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent>
													{row.cases.slice(1).map((caseName) => (
														<DropdownMenuItem
															key={caseName}
															className="flex justify-between"
															onSelect={(e) => e.preventDefault()}
														>
															{caseName}
															<Button
																onClick={() =>
																	handleRemoveCase(index, caseName)
																}
																className="w-3 h-3 cursor-pointer"
																variant="ghost"
															>
																<X />
															</Button>
														</DropdownMenuItem>
													))}
												</DropdownMenuContent>
											</DropdownMenu>
										)}
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													size="icon"
													className="h-6 w-6 shrink-0"
												>
													<Plus className="h-4 w-4" />
												</Button>
											</PopoverTrigger>
											<PopoverContent className="p-0 w-[300px]" align="start">
												<Command>
													<CommandInput placeholder="Search test cases..." />
													<CommandList>
														<CommandEmpty>No results found.</CommandEmpty>
														<CommandGroup>
															{ALL_TEST_CASES.map((testCase) => (
																<CommandItem
																	key={testCase.name}
																	value={testCase.name}
																	onSelect={() =>
																		handleToggleCase(index, testCase.name)
																	}
																>
																	<Check
																		className={cn(
																			"mr-2 h-4 w-4",
																			row.cases.includes(testCase.name)
																				? "opacity-100"
																				: "opacity-0"
																		)}
																	/>
																	<div className="flex flex-col">
																		<span className="font-medium">
																			{testCase.name}
																		</span>
																		<span className="text-xs text-muted-foreground">
																			{testCase.description}
																		</span>
																	</div>
																	<Badge variant="outline" className="ml-auto">
																		{testCase.type}
																	</Badge>
																</CommandItem>
															))}
														</CommandGroup>
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>
									</div>
								</TableCell>
								<TableCell className="text-center px-4 py-2">
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="w-full h-8 cursor-pointer"
												onClick={() => setDeleteIndex(index)}
											>
												<Trash2
													className="text-red-600 cursor-pointer"
													width={18}
												/>
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													Are you absolutely sure?
												</AlertDialogTitle>
												<AlertDialogDescription>
													This will permanently delete the variable.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
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
							className="cursor-pointer border-t-2 border-gray-300 bg-gray-50/50 hover:bg-gray-100"
						>
							<TableCell
								colSpan={4}
								className="px-4 py-3 text-sm text-gray-600 font-medium"
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
