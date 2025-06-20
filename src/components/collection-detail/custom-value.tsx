"use client";

import React, { startTransition, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TableRowV2,
} from "@/components/ui/table";
import { DATA_TYPES } from "@/lib/constants";
import { Separator } from "../ui/separator";
import { Edit, Trash } from "lucide-react";
import { z } from "zod";
import { customValueSchema } from "@/lib/zodSchema";
import { DeleteCustomValue } from "../delete/delete-custom-value";
import { CustomValueForm } from "./custom-value-form";
import {
	createCustomTestCaseAction,
	getCustomTestCaseAction,
} from "@/action/custom-test-case-action";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { getAllPredefinedAction } from "@/action/pre-defined-action";

// Interface for your state
interface RequestParam {
	name: string;
	value: string;
	type: string;
}

// Interface for the data coming from your API
// This is helpful for TypeScript to understand the data structure
interface ApiData {
	id: string;
	name: string;
	value: string;
	dataType: {
		name: string; // Assuming the type name is here
		// add other properties of dataType if they exist
	};
	// add other properties from your API response
}

export const CustomValue = (): React.JSX.Element => {
	const [requestParams, setRequestParams] = useState<RequestParam[]>([]);

	const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [editingValue, setEditingValue] = useState<z.infer<
		typeof customValueSchema
	> | null>(null);

	const pathname = usePathname();

	useEffect(() => {
		const fetchData = async () => {
			const dataFromApi: ApiData[] = (await getCustomTestCaseAction(
				pathname.split("/")[2]
			)) as ApiData[];

			console.log("Data from API:", dataFromApi); // Good for debugging

			if (dataFromApi && Array.isArray(dataFromApi)) {
				// Map the API response to the structure your state expects
				const formattedParams: RequestParam[] = dataFromApi.map((item) => ({
					name: item.name,
					value: item.value,
					type: item.dataType.name, // Adjust this property name if necessary
				}));

				// Set the formatted data into your state
				setRequestParams(formattedParams);
			}
		};
		fetchData();
	}, [pathname]); // Added pathname as a dependency

	const handleAddCustomValue = async (
		data: z.infer<typeof customValueSchema>
	) => {
		setRequestParams((prev) => [
			...prev,
			{
				name: data.nameCase,
				value: data.value,
				type: data.typeCase,
			},
		]);
	};

	const handleEdit = (index: number) => {
		const param = requestParams[index];
		setEditingIndex(index);
		setEditingValue({
			nameCase: param.name,
			value: param.value,
			typeCase: param.type,
		});
	};

	const handleDeleteConfirm = () => {
		if (deleteIndex !== null) {
			setRequestParams((prev) => prev.filter((_, i) => i !== deleteIndex));
			setDeleteIndex(null);
		}
	};

	return (
		<div className="flex flex-col items-end gap-5 relative self-stretch w-full">
			<div className="inline-flex items-start justify-end gap-5 relative">
				<Select>
					<SelectTrigger className="w-[204px] px-3 py-2 bg-[#ffffff] rounded-md border border-solid border-[#cbd5e1]">
						<SelectValue
							placeholder="Select to filter"
							className="text-slate-400"
						/>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All</SelectItem>
						<Separator />
						{DATA_TYPES.map((type) => (
							<SelectItem key={type} value={type.toLowerCase()}>
								{type}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<CustomValueForm
					onAddCustomValue={handleAddCustomValue}
					onEditCustomValue={(data, index) => {
						setRequestParams((prev) =>
							prev.map((item, i) =>
								i === index
									? {
											name: data.nameCase,
											value: data.value,
											type: data.typeCase,
									  }
									: item
							)
						);
					}}
					editingIndex={editingIndex}
					editingValue={editingValue}
					setEditingIndex={setEditingIndex}
				/>
			</div>

			<Card className="w-full border border-solid border-slate-200 p-0">
				<CardContent className="p-0">
					<Table>
						<TableHeader className="text-center">
							<TableRowV2 className="border-b border-slate-200 h-12">
								<TableHead className="pl-6">Name</TableHead>
								<TableHead className="pl-6">Value</TableHead>
								<TableHead className="pl-6">Type</TableHead>
								<TableHead className="pl-6">Action</TableHead>
							</TableRowV2>
						</TableHeader>
						<TableBody>
							{requestParams.map((param, index) => (
								<TableRow
									key={index}
									className="border-b border-slate-200 h-12"
								>
									<TableCell className="pl-6">{param.name}</TableCell>
									<TableCell className="pl-6 text-slate-500">
										{param.value}
									</TableCell>
									<TableCell className="pl-6">
										<Badge
											variant="outline"
											className="bg-white text-[#006fee] font-medium text-xs"
										>
											{param.type}
										</Badge>
									</TableCell>
									<TableCell className="pl-6 py-4 flex  items-center gap-4">
										<Trash
											className="text-red-500 cursor-pointer size-4"
											onClick={() => {
												setDeleteIndex(index);
												setIsDialogOpen(true);
											}}
										/>
										<Edit
											className="cursor-pointer size-4"
											onClick={() => handleEdit(index)}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Confirmation Dialog */}
			<DeleteCustomValue
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				onConfirm={handleDeleteConfirm}
			/>
		</div>
	);
};
