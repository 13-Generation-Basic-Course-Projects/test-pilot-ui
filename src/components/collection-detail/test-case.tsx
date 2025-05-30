"use client";
import React from "react";

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
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Plus, X } from "lucide-react";
import { useApiBodyStore, ApiBodyRow } from "@/store/body-api-slice";
import { Button } from "../ui/button";

// Available data types
const dataTypeOptions = ["string", "number", "boolean", "date"] as const;
type DataType = (typeof dataTypeOptions)[number];

// Predefined case options by data type
const caseByDataType: Record<DataType, string[]> = {
	string: [
		"Empty String",
		"Null Value",
		"Length",
		"Alphanumeric Mix",
		"Only Space",
		"Special Character",
	],
	number: ["Zero", "Negative", "Non-numeric String", "Large Number"],
	boolean: ["True", "False", "Not Boolean"],
	date: ["Invalid Date", "Future Date", "Past Date", "ISO Format"],
};

export const TestCase = () => {
	// The component now consumes the simplified state
	const { apiBodyRows, updateRow } = useApiBodyStore();

	if (!apiBodyRows || apiBodyRows.length === 0) {
		return (
			<p className="min-h-[480px]">Parse a JSON body to see test cases.</p>
		);
	}

	// Handlers are now simpler, calling the centralized `updateRow` function
	const handleToggleCase = (row: ApiBodyRow, selectedCase: string) => {
		const newTestCases = row.testCases.includes(selectedCase)
			? row.testCases.filter((c) => c !== selectedCase)
			: [...row.testCases, selectedCase];
		updateRow(row.id, { testCases: newTestCases });
	};

	const handleRemoveCase = (row: ApiBodyRow, caseToRemove: string) => {
		const newTestCases = row.testCases.filter((c) => c !== caseToRemove);
		updateRow(row.id, { testCases: newTestCases });
	};

	const handleChangeDataType = (rowId: string, newType: string) => {
		updateRow(rowId, { dataType: newType });
	};

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
						{apiBodyRows.map((row) => (
							<TableRow
								key={row.id}
								className="hover:bg-gray-50 border-b border-gray-200"
							>
								{/* Field Name */}
								<TableCell className="py-2 border-r border-gray-200">
									<span className="block px-2 py-1 text-sm">{row.id}</span>
								</TableCell>

								{/* Value */}
								<TableCell className="px-4 py-2 border-r border-gray-200">
									<span className="block px-2 py-1 text-sm">
										{String(row.value)}
									</span>
								</TableCell>

								{/* Data Type Dropdown */}
								<TableCell className="px-4 py-2 border-r border-gray-200">
									<select
										value={row.dataType}
										onChange={(e) =>
											handleChangeDataType(row.id, e.target.value)
										}
										className="w-full px-2 py-1 text-sm bg-transparent focus:outline-none"
									>
										{dataTypeOptions.map((type) => (
											<option key={type} value={type}>
												{type.charAt(0).toUpperCase() + type.slice(1)}
											</option>
										))}
									</select>
								</TableCell>

								{/* Test Cases */}
								<TableCell className="px-4 py-2 border-r border-gray-200 flex items-center justify-end gap-6 flex-row-reverse">
									<div className="flex flex-wrap items-center">
										{row.testCases.slice(0, 1).map((c) => (
											<span
												key={c}
												className="bg-black text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
											>
												{c}
												<X
													className="w-3 h-3 cursor-pointer"
													onClick={() => handleRemoveCase(row, c)}
												/>
											</span>
										))}
										{row.testCases.length > 1 && (
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="link" size="sm">
														+{row.testCases.length - 1}
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent>
													{row.testCases.map((c) => (
														<div
															key={c}
															className="flex items-center justify-between px-2 py-1 text-sm hover:bg-gray-100"
														>
															<span>{c}</span>
															<X
																className="w-3 h-3 cursor-pointer"
																onClick={() => handleRemoveCase(row, c)}
															/>
														</div>
													))}
												</DropdownMenuContent>
											</DropdownMenu>
										)}
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="secondary" className="size-6">
												<Plus />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent className="max-h-48 overflow-y-auto w-[220px] space-y-1">
											{(caseByDataType[row.dataType as DataType] || []).map(
												(option) => (
													<DropdownMenuItem
														key={option}
														onClick={() => handleToggleCase(row, option)}
														className={`cursor-pointer ${
															row.testCases.includes(option)
																? "bg-blue-100 font-semibold rounded"
																: ""
														}`}
													>
														{option}
													</DropdownMenuItem>
												)
											)}
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};
