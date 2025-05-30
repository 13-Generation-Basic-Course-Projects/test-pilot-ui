"use client";
import { useState } from "react";
import {
	TableBody,
	TableCell,
	TableHeadV2,
	TableHeader,
	TableRow,
	TableRowV2,
	TableV2,
} from "@/components/ui/table";

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
} from "@/components/ui/alert-dialog"

import { Trash2 } from "lucide-react";

export default function VariableTable() {
	const [rows, setRows] = useState([{ variable: "habitId", value: "1" }]);
	const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

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

	const handleDeleteRow = () => {
		if (deleteIndex !== null) {
			setRows(rows.filter((_, i) => i !== deleteIndex));
			setDeleteIndex(null);
		}
	};

	return (
		<div className="space-y-5">
			<p className="font-semibold text-lg">Project Variable</p>
			<TableV2 >
				<TableHeader>
					<TableRowV2>
						<TableHeadV2 className=" border-r text-sm">Variable</TableHeadV2>
						<TableHeadV2 className="border-r text-sm">Value</TableHeadV2>
						<TableHeadV2 className=" text-sm">Action</TableHeadV2>
					</TableRowV2>
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
							<TableCell className="border-r">
								<input
									type="text"
									value={row.value}
									onChange={(e) => handleChange(index, "value", e.target.value)}
									className="w-full px-2 py-1 text-sm border border-transparent focus:outline-none focus:border-gray-300"
									placeholder="Enter value"
								/>
							</TableCell>
							<TableCell>
								<AlertDialog>
									<AlertDialogTrigger asChild className="flex justify-center items-center">
										<Trash2
											className="text-[#E2001A] cursor-pointer"
											width={20}
											onClick={() => setDeleteIndex(index)}
										/>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone. This will permanently delete your variable.
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
						className="cursor-pointer hover:bg-muted"
					>
						<TableCell colSpan={3} className="text-sm text-gray-500 py-3">
							+ Add
						</TableCell>
					</TableRow>
				</TableBody>
			</TableV2>
		</div>
	);
}
