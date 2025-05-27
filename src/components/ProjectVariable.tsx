"use client";
import { useState } from "react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export default function VariableTable() {
	const [rows, setRows] = useState([{ variable: "habitId", value: "1" }]);

	const handleAddRow = () => {
		setRows([...rows, { variable: "", value: "" }]);
	};

	const handleChange = (
		index: number,
		field: "variable" | "value",
		newValue: string
	) => {
		const updatedRows = [...rows];
		updatedRows[index][field] = newValue;
		setRows(updatedRows);
	};

	return (
		<Table className="border rounded-md">
			<TableCaption className="caption-top mb-4 text-left text-[24px] text-black font-semibold cursor-default">
				Project Variables
			</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className="w-1/2 border-r text-sm">Variable</TableHead>
					<TableHead className="w-1/2 text-sm">Value</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{rows.map((row, index) => (
					<TableRow key={index}>
						<TableCell className="border-r">
							<input
								type="text"
								value={row.variable}
								onChange={(e) =>
									handleChange(index, "variable", e.target.value)
								}
								className="w-full px-2 py-1 text-sm border border-transparent focus:outline-none focus:border-gray-300"
								placeholder="Enter variable"
							/>
						</TableCell>
						<TableCell>
							<input
								type="text"
								value={row.value}
								onChange={(e) => handleChange(index, "value", e.target.value)}
								className="w-full px-2 py-1 text-sm border border-transparent focus:outline-none focus:border-gray-300"
								placeholder="Enter value"
							/>
						</TableCell>
					</TableRow>
				))}

				<TableRow
					onClick={handleAddRow}
					className="cursor-pointer hover:bg-muted"
				>
					<TableCell colSpan={2} className="text-sm text-gray-500">
						+ Add
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	);
}
