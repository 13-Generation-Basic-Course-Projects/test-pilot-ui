"use client";

import React, { useTransition, useEffect, useState } from "react"; // ✨ 1. Import useTransition
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
import { toast } from "sonner";
import { usePathname } from "next/navigation";

// ✨ 2. Import the delete action
import {
	getCustomTestCaseAction,
	deleteCustomTestCaseAction, // Import the delete action
} from "@/action/custom-test-case-action";

// ✨ 3. Update the state interface to include the ID
interface CustomValueRow {
	id: string; // The ID is crucial for deletion
	name: string;
	value: string;
	type: string;
}

interface ApiData {
	id: string;
	name: string;
	value: string;
	dataType: {
		name: string;
	};
}

export const CustomValue = (): React.JSX.Element => {
	// ✨ Use the updated interface for your state
	const [requestParams, setRequestParams] = useState<CustomValueRow[]>([]);

	const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [editingValue, setEditingValue] = useState<z.infer<
		typeof customValueSchema
	> | null>(null);

	const [isPending, startTransition] = useTransition(); // ✨ 4. Add transition for loading state
	const pathname = usePathname();

	useEffect(() => {
		const fetchData = async () => {
			const dataFromApi = (await getCustomTestCaseAction(
				pathname.split("/")[2]
			)) as ApiData[];

			if (dataFromApi && Array.isArray(dataFromApi)) {
				// ✨ 5. Map the `id` from the API into your state
				const formattedParams: CustomValueRow[] = dataFromApi.map((item) => ({
					id: item.id, // Make sure to include the ID here
					name: item.name,
					value: item.value,
					type: item.dataType.name,
				}));
				setRequestParams(formattedParams);
			}
		};
		fetchData();
	}, [pathname]);

	const handleAddCustomValue = async (
		data: z.infer<typeof customValueSchema>
	) => {
		// This function will need to be updated to also call a create action
		// and get the new ID back from the database to add to the state.
		// For now, we'll leave it as a UI-only addition.
		// setRequestParams((prev) => [ ...prev, { id: newId, name: ..., etc... }]);
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

	// ✨ 6. Implement the delete handler to call the server action
	const handleDeleteConfirm = async () => {
		if (deleteIndex === null) return;
		setRequestParams((prev) => prev.filter((_, i) => i !== deleteIndex));

		const itemToDelete = requestParams[deleteIndex];
		if (!itemToDelete) return;

		startTransition(async () => {
			await deleteCustomTestCaseAction(itemToDelete.id);

			setDeleteIndex(null);
		});
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
						// This would need to call an "update" server action
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
									key={param.id}
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
									<TableCell className="pl-6 py-4 flex items-center gap-4">
										<Trash
											className="text-red-500 cursor-pointer size-4"
											// ✨ 7. Disable button while an action is pending
											style={{
												pointerEvents: isPending ? "none" : "auto",
												opacity: isPending ? 0.5 : 1,
											}}
											onClick={() => {
												setDeleteIndex(index);
												setIsDialogOpen(true);
											}}
										/>
										<Edit
											className="cursor-pointer size-4"
											style={{
												pointerEvents: isPending ? "none" : "auto",
												opacity: isPending ? 0.5 : 1,
											}}
											onClick={() => handleEdit(index)}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<DeleteCustomValue
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				onConfirm={handleDeleteConfirm}
			/>
		</div>
	);
};
