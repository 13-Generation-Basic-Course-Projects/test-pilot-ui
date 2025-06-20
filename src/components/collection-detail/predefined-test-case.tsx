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
import { Skeleton } from "@/components/ui/skeleton"; // 1. Import the Skeleton component

interface PredefinedCase {
	case: string;
	value: any;
	type: string;
}

export default function PredefinedTestCase() {
	const [selectedType, setSelectedType] = useState<string>("");
	const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
	const [predefined, setPredefined] = useState<PredefinedCase[]>([]);
	const [filterTypes, setFilterTypes] = useState<string[]>([]);

	// 2. Add the isLoading state
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const handlePredefined = async () => {
			// It's good practice to ensure loading is true at the start of a fetch.
			setIsLoading(true);
			try {
				const backendData = await getAllPredefinedAction();
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
			} catch (error) {
				console.error("Failed to fetch predefined cases:", error);
				// Optionally, you could set an error state here
			} finally {
				// 3. Set loading to false after the fetch is complete (or fails)
				setIsLoading(false);
			}
		};
		handlePredefined();
	}, []);

	const filteredValues = selectedType
		? predefined.filter((item) => item.type === selectedType)
		: predefined;

	return (
		<div className="p-6 mx-auto space-y-6">
			<div className="flex justify-end">
				{/* ... your filter dropdown code remains the same ... */}
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
							{/* 4. Conditional rendering: Show skeletons or data */}
							{isLoading
								? [...Array(5)].map((_, index) => (
										<TableRow
											key={index}
											className="border-b border-slate-200 last:border-b-0"
										>
											<TableCell className="h-12 pl-6 border-r border-slate-200">
												<Skeleton className="h-4 w-3/4" />
											</TableCell>
											<TableCell className="h-12 pl-6 border-r border-slate-200">
												<Skeleton className="h-4 w-1/2" />
											</TableCell>
											<TableCell className="h-12 pl-6">
												<Skeleton className="h-6 w-16 rounded-full" />
											</TableCell>
										</TableRow>
								  ))
								: filteredValues.map((item) => (
										<TableRow
											key={`${item.case}-${item.type}`}
											className="border-b border-slate-200 last:border-b-0"
										>
											<TableCell className="h-12 pl-6 font-body text-[#34302b] border-r border-slate-200">
												{item.case}
											</TableCell>
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
