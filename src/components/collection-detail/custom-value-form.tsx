"use client";

import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import z from "zod";
import { customValueSchema } from "@/lib/zodSchema";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DATA_TYPES } from "@/lib/constants";
import { toast } from "sonner";

type CustomValueFormProps = {
	onAddCustomValue: (value: z.infer<typeof customValueSchema>) => void;
	onEditCustomValue: (
		value: z.infer<typeof customValueSchema>,
		index: number
	) => void;
	editingIndex: number | null;
	editingValue: z.infer<typeof customValueSchema> | null;
	setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

const defaultFormValues = {
	nameCase: "",
	typeCase: "",
	value: "",
	description: "",
};

export const CustomValueForm: React.FC<CustomValueFormProps> = ({
	onAddCustomValue,
	onEditCustomValue,
	editingIndex,
	editingValue,
	setEditingIndex,
}) => {
	const [open, setOpen] = useState(false);

	const form = useForm<z.infer<typeof customValueSchema>>({
		resolver: zodResolver(customValueSchema),
		// This correctly controls the form's values. It stays.
		values: editingValue || defaultFormValues,
	});

	// --- 1. RE-INTRODUCE useEffect FOR THIS SPECIFIC PURPOSE ---
	// This effect's ONLY job is to open the dialog when an edit starts.
	useEffect(() => {
		if (editingIndex !== null) {
			setOpen(true);
		}
	}, [editingIndex]);

	function onSubmit(values: z.infer<typeof customValueSchema>) {
		if (editingIndex !== null) {
			onEditCustomValue(values, editingIndex);
			toast.success("Custom value has been updated.");
		} else {
			onAddCustomValue(values);
			toast.success("New custom value has been added.");
		}
		setOpen(false);
	}

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (!isOpen) {
			setEditingIndex(null);
		}
	};

	const handleAddClick = () => {
		setEditingIndex(null);
		setOpen(true);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<Button className="cursor-pointer text-[16px]" onClick={handleAddClick}>
				Add Custom
			</Button>
			<DialogContent className="p-8 px-12 font-sans">
				<DialogHeader>
					<DialogTitle>
						<p className="text-3xl not-even:text-center mb-4">
							{editingIndex !== null
								? "Edit Custom Value"
								: "Create Custom Value"}
						</p>
					</DialogTitle>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							{/* Form fields are correct and do not need changes */}
							<FormField
								control={form.control}
								name="nameCase"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xl">Name Case</FormLabel>
										<FormControl>
											<Input
												placeholder="My Phone"
												{...field}
												className="text-xl"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xl">Description</FormLabel>
										<FormControl>
											<Textarea placeholder="description..." {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="typeCase"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xl">Type Case</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select type case" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{DATA_TYPES.map((type) => (
													<SelectItem key={type} value={type.toLowerCase()}>
														{type}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="value"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xl">Value</FormLabel>
										<FormControl>
											<Input placeholder="Value or Regex" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="w-full flex items-center justify-end">
								<Button type="submit" className="cursor-pointer">
									Create
								</Button>
							</div>
						</form>
					</Form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};
