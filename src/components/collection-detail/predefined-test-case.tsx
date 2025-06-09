"use client";
import { useState } from "react";
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

interface TestCase {
	case: string;
	value: string | number | null | boolean;
	type: string;
}

const predefinedValues = [
	{ type: "String", case: "Empty String", value: "" },
	{ type: "String", case: "Null", value: null },
	{
		type: "String",
		case: "String length define length for validation",
		value: "StringLength",
	},
	{ type: "String", case: "Numeric String", value: "12345" },
	{ type: "String", case: "Alphanumeric Mix", value: "12345abc" },
	{ type: "String", case: "Only Space", value: " " },
	{ type: "String", case: "Special Character", value: "@#&*!" },
	{ type: "Date", case: "Valid Date Format", value: "2023-01-01T10:00:00Z" },
	{ type: "Date", case: "Invalid Date Format", value: "22/04/202aaa" },
	{ type: "Date", case: "Past Date", value: "1900-01-01" },
	{ type: "Date", case: "Future Date", value: "2050-01-01" },
	{ type: "Date", case: "Invalid Calendar Date", value: "2023-02-30" },
	{ type: "Date", case: "Invalid Month Date", value: "2023-13-01" },
	{ type: "File", case: "Incorrect File Type", value: ".exe" },
	{ type: "File", case: "Image File", value: ".jpg" },
	{ type: "File", case: "Video File", value: ".mp4" },
	{ type: "File", case: "Empty File", value: "0 byte file" },
	{ type: "File", case: "MaxSize (single file)", value: "5Mb (limit 5Mb)" },
	{ type: "File", case: "MaxSize (multiple file)", value: "25Mb (limit 5Mb)" },
	{ type: "Integer", case: "Positive Number", value: 5 },
	{ type: "Integer", case: "Large Positive Number", value: 1000 },
	{ type: "Integer", case: "Null", value: null },
	{ type: "Integer", case: "Float Number", value: 1.23 },
	{ type: "Integer", case: "Negative Number", value: -1 },
	{ type: "Integer", case: "Zero", value: 0 },
	{ type: "Integer", case: "Max boundary", value: "max" },
	{ type: "Integer", case: "Min boundary", value: "min" },
	{ type: "Integer", case: "String number", value: "12" },
	{ type: "Integer", case: "High Precision Float", value: 0.12345678912345 },
	{ type: "Boolean", case: "Null", value: null },
	{ type: "Boolean", case: "True", value: true },
	{ type: "Boolean", case: "False", value: false },
	{ type: "Boolean", case: "Boolean as Integer (1)", value: 1 },
	{ type: "Boolean", case: "Boolean as Integer (0)", value: 0 },
	{ type: "Boolean", case: "Boolean as String (true)", value: "true" },
	{ type: "Boolean", case: "Boolean as String (false)", value: "false" },
	{
		type: "UUID",
		case: "Valid UUID",
		value: "550e8400-e29b-41d4-a716-446655440000",
	},
	{ type: "UUID", case: "Invalid UUID", value: "550e8400-e29b-41d4-a716" },
	{ type: "ENUM", case: "Valid Enum Value", value: "active" },
	{ type: "ENUM", case: "Invalid Enum Value", value: "deleted" },
	{ type: "Array", case: "Empty Array", value: [] },
	{ type: "Array", case: "Non-Empty Integer Array", value: [1] },
	{ type: "Array", case: "Non-Empty String Array", value: ["1"] },
	{ type: "Array", case: "Non-Empty Boolean Array", value: [true, false] },
	{ type: "Array", case: "Mixed Data Type Array", value: [1, "string", true] },
	{
		type: "Array",
		case: "Nested Arrays",
		value: [
			[1, 2],
			[3, 4],
		],
	},
	{ type: "Array", case: "Duplicate Elements", value: [1, 2, 2] },
	{ type: "Array", case: "Array with Null Element (Number)", value: [1, null] },
	{
		type: "Array",
		case: "Array with Null Element (String)",
		value: ["1", null],
	},
	{
		type: "Array",
		case: "Array with Null Element (Boolean)",
		value: [true, null],
	},
];

const filterTypes: string[] = [
	"String",
	"Date",
	"Integer",
	"Array",
	"File",
	"UUID",
	"ENUM",
];
export default function PredefinedTestCase() {
	const [selectedType, setSelectedType] = useState<string>("");
	const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
	const filteredValues = selectedType
		? predefinedValues.filter((item) => item.type === selectedType)
		: predefinedValues;

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
								<TableRow key={`${item.case}-${item.type}`} className="...">
									<TableCell className="h-12 pl-6 font-body text-[#34302b] border-r border-slate-200">
										{item.case}
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
