"use client";
import { useEffect, useState } from "react";
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
import { getAllPredefinedAction } from "@/action/pre-defined-action";

// 1. Define an interface for our structured data
interface PredefinedCase {
	case: string;
	value: any;
	type: string;
}

// The hardcoded `predefinedValues` is no longer needed as we are fetching from the backend.
// const predefinedValues = [ ... ];

export default function PredefinedTestCase() {
	const [selectedType, setSelectedType] = useState<string>("");
	const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

	// 2. Initialize state to hold data from the backend
	const [predefined, setPredefined] = useState<PredefinedCase[]>([]);
	const [filterTypes, setFilterTypes] = useState<string[]>([]);

	useEffect(() => {
		const handlePredefined = async () => {
			// Fetch the raw data from your backend action
			const backendData = await getAllPredefinedAction();

			// 3. Check if data is valid and then transform it
			if (backendData && Array.isArray(backendData)) {
				const transformedData: PredefinedCase[] = backendData.map(
					(item: any) => ({
						case: item.name,
						value: item.value,
						type: item.dataType.name,
					})
				);

				setPredefined(transformedData);

				const uniqueTypes = [
					...new Set(transformedData.map((item) => item.type)),
				];
				setFilterTypes(uniqueTypes);
			}
		};
		handlePredefined();
	}, []);

	// 5. Filter the data that is now in our state
	const filteredValues = selectedType
		? predefined.filter((item) => item.type === selectedType)
		: predefined;

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
						<ul className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
							<li
								onClick={() => {
									setSelectedType("");
									setDropdownOpen(false);
								}}
								className="px-4 py-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer font-semibold"
							>
								All Predefined Cases
							</li>
							{/* Render the dynamically generated filter types */}
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
							{/* 6. Map over the filteredValues from the state */}
							{filteredValues.map((item) => (
								<TableRow
									key={`${item.case}-${item.type}`}
									className="border-b border-slate-200 last:border-b-0"
								>
									{/* NAME CELL - Clamped */}
									<TableCell className="h-12 pl-6 font-body text-[#34302b] border-r border-slate-200 max-w-md">
										<div className="truncate" title={item.case}>
											{item.case}
										</div>
									</TableCell>

									{/* VALUE CELL - Clamped */}
									<TableCell className="h-12 pl-6 font-detail text-slate-500 border-r border-slate-200 max-w-xs">
										<div
											className="truncate"
											title={JSON.stringify(item.value)}
										>
											{/* Handle rendering of different value types, e.g., null or arrays */}
											{JSON.stringify(item.value)}
										</div>
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
