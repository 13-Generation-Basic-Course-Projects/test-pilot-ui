"use client";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TableRowV2,
} from "@/components/ui/table";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import useTestCaseStore from "@/store/test-case-store";

interface TestCase {
	name: string;
	value: string | number;
	type: string;
}

const initialPredefinedValues: TestCase[] = [
	{ name: "Empty String", value: "", type: "String" },
	{ name: "Null", value: "null", type: "String" },
	{ name: "length", value: "define length for validation", type: "String" },
	{ name: "Numeric String", value: "12345", type: "String" },
	{ name: "Alphanumeric Mix", value: "12345abc", type: "String" },
	{ name: "Only Space", value: " ", type: "String" },
	{ name: "Special Character", value: "@#&*!", type: "String" },

	{ name: "Valid Date Format", value: "2023-01-01T10:00:00Z", type: "Date" },
	{ name: "Invalid Date Format", value: "22/04/202aaa", type: "Date" },
	{ name: "Past Date", value: "1900-01-01", type: "Date" },
	{ name: "Future Date", value: "2050-01-01", type: "Date" },
	{ name: "Invalid Calendar Date", value: "2023-02-30", type: "Date" },
	{ name: "Invalid Month Date", value: "2023-13-01", type: "Date" },

	{ name: "Incorrect File Type", value: ".exe", type: "File" },
	{ name: "Image File", value: ".jpg", type: "File" },
	{ name: "Video File", value: ".mp4", type: "File" },
	{ name: "Empty File", value: "0 byte file", type: "File" },
	{ name: "MaxSize (single file)", value: "5Mb (limit 5Mb)", type: "File" },
	{ name: "MaxSize (multiple file)", value: "25Mb (limit 5Mb)", type: "File" },

	{ name: "Positive Number", value: 5, type: "Number" },
	{ name: "Large Positive Number", value: 1000, type: "Number" },
	{ name: "Null", value: "null", type: "Number" },
	{ name: "Float Number", value: 1.23, type: "Number" },
	{ name: "Negative Number", value: -1, type: "Number" },
	{ name: "Zero", value: 0, type: "Number" },
	{ name: "Max boundary", value: "max", type: "Number" },
	{ name: "Min boundary", value: "min", type: "Number" },
	{ name: "String number", value: "12", type: "Number" },
	{ name: "High Precision Float", value: 0.12345678912345, type: "Number" },

	{ name: "Null", value: "null", type: "Boolean" },
	{ name: "True", value: "true", type: "Boolean" },
	{ name: "False", value: "false", type: "Boolean" },
	{ name: "Boolean as Integer (1)", value: 1, type: "Boolean" },
	{ name: "Boolean as Integer (0)", value: 0, type: "Boolean" },
	{ name: "Boolean as String (true)", value: "true", type: "Boolean" },
	{ name: "Boolean as String (false)", value: "false", type: "Boolean" },

	{
		name: "Valid UUID",
		value: "550e8400-e29b-41d4-a716-446655440000",
		type: "UUID",
	},
	{ name: "Invalid UUID", value: "550e8400-e29b-41d4-a716", type: "UUID" },

	{ name: "Valid Enum Value", value: "active", type: "ENUM" },
	{ name: "Invalid Enum Value", value: "deleted", type: "ENUM" },

	{ name: "Empty Array", value: "[]", type: "Array" },
	{ name: "Non-Empty Integer Array", value: "[1]", type: "Array" },
	{ name: "Non-Empty String Array", value: "['1']", type: "Array" },
	{ name: "Non-Empty Boolean Array", value: "[true,false]", type: "Array" },
	{
		name: "Mixed Data Type Array",
		value: "[1, 'string', true]",
		type: "Array",
	},
	{ name: "Nested Arrays", value: "[[1,2], [3,4]]", type: "Array" },
	{ name: "Duplicate Elements", value: "[1, 2, 2]", type: "Array" },
	{
		name: "Array with Null Element (Number)",
		value: "[1, null]",
		type: "Array",
	},
	{
		name: "Array with Null Element (String)",
		value: "['1', null]",
		type: "Array",
	},
	{
		name: "Array with Null Element (Boolean)",
		value: "[true, null]",
		type: "Array",
	},
];

const filterTypes: string[] = [
	"String",
	"Date",
	"Number",
	"Array",
	"File",
	"UUID",
	"ENUM",
];
export default function PredefinedTestCase() {
	// 2. Get the test cases directly from the store
	// 1. Get BOTH lists from the store
	const { predefinedTestCases, customTestCases } = useTestCaseStore();

	// 2. Combine them into one master list for display
	// useMemo prevents re-creating the array on every render
	const combinedTestCases = useMemo(
		() => [...predefinedTestCases, ...customTestCases],
		[predefinedTestCases, customTestCases]
	);

	const [selectedType, setSelectedType] = useState<string>("");
	const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

	// 3. Filter the combined list
	const filteredValues = selectedType
		? combinedTestCases.filter(
				(item) => item.type.toLowerCase() === selectedType.toLowerCase()
		  )
		: combinedTestCases;
	return (
		<div className="p-6 mx-auto space-y-6">
			<div className="flex justify-end">
				<div className="relative w-64 text-sm">
					<button
						onClick={() => setDropdownOpen(!dropdownOpen)}
						className="w-full border px-4 py-2 rounded-md shadow-sm bg-white text-left text-gray-700 flex items-center justify-between"
					>
						<span>{selectedType || "Select to filter"}</span>
						<ChevronDown
							className={`h-4 w-4 transition-transform duration-200 ${
								dropdownOpen ? "rotate-180" : ""
							}`}
						/>
					</button>
					{dropdownOpen && (
						<ul className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
							<li
								onClick={() => {
									setSelectedType("");
									setDropdownOpen(false);
								}}
								className="px-4 py-2 border border-gray-200 hover:bg-gray-100 cursor-pointer font-semibold"
							>
								Predefined Case
							</li>
							{filterTypes.map((type, index) => (
								<li
									key={index}
									onClick={() => {
										setSelectedType(type);
										setDropdownOpen(false);
									}}
									className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
								>
									{type}
								</li>
							))}
						</ul>
					)}
				</div>
			</div>

			<Card className="w-full border border-solid border-slate-200 p-0">
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRowV2 className="border-b border-slate-200">
								<TableHead className="h-12 text-left pl-6 font-medium text-slate-500 text-sm border-r border-slate-200">
									Name
								</TableHead>
								<TableHead className="h-12 text-left pl-6 font-medium text-slate-500 text-sm border-r border-slate-200">
									Value
								</TableHead>
								<TableHead className="h-12 text-left pl-6 font-medium text-slate-500 text-sm">
									Type
								</TableHead>
							</TableRowV2>
						</TableHeader>
						<TableBody>
							{filteredValues.map((item) => (
								<TableRow key={`${item.name}-${item.type}`} className="...">
									<TableCell className="h-12 pl-6 font-body text-[#34302b] border-r border-slate-200">
										{item.name}
									</TableCell>
									<TableCell className="h-12 pl-6 font-detail text-slate-500 border-r border-slate-200">
										{item.value}
									</TableCell>
									<TableCell className="h-12 pl-6">
										<Badge
											variant="outline"
											className="bg-[#ffffff] text-[#006fee] font-medium text-xs"
										>
											{item.type}
										</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
