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
} from "@/components/ui/table";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface TestCase {
	name: string;
	value: string | number;
	type: string;
}

const predefinedValues: TestCase[] = [
	{ name: "Undefined", value: "undefined", type: "String" },
	{ name: "Null", value: "null", type: "String" },
	{ name: "Boolean", value: "true/false", type: "Boolean" },
	{ name: "Invalid date format", value: "22/04/202aaa", type: "Date" },
	{ name: "Special Character", value: "&*@&*$%", type: "String" },
	{ name: "MaxSize (single file)", value: "5Mb (limit 5Mb)", type: "File" },
	{ name: "Negative", value: "-1", type: "Number" },
	{ name: "Enum", value: "ENUM", type: "ENUM" },
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
							<TableRow className="border-b border-slate-200">
								<TableHead className="h-12 text-left pl-6 font-medium text-slate-500 text-sm border-r border-slate-200">
									Name
								</TableHead>
								<TableHead className="h-12 text-left pl-6 font-medium text-slate-500 text-sm border-r border-slate-200">
									Value
								</TableHead>
								<TableHead className="h-12 text-left pl-6 font-medium text-slate-500 text-sm">
									Type
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredValues.map((item) => (
								<TableRow key={item.name} className="border-b border-slate-200">
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
