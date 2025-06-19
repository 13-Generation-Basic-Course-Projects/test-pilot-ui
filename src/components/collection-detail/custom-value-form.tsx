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
	// The type of editingValue now correctly reflects the union type from the schema
	editingValue: z.infer<typeof customValueSchema> | null;
	setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
	className?: string;
};

// --- MODIFIED: Default form values must match one of the schema shapes ---
// We'll default to the 'string' type shape.
const defaultFormValues: z.infer<typeof customValueSchema> = {
	nameCase: "",
	typeCase: "string", // Default to string
	value: "",
	description: "",
};

export const CustomValueForm: React.FC<CustomValueFormProps> = ({
	onAddCustomValue,
	onEditCustomValue,
	editingIndex,
	editingValue,
	setEditingIndex,
	className,
}) => {
	const [open, setOpen] = useState(false);

	const form = useForm<z.infer<typeof customValueSchema>>({
		resolver: zodResolver(customValueSchema),
		// This correctly controls the form's values. It stays.
		// When editingValue is provided, it will be used.
		// When adding a new value, defaultFormValues will be used.
		values: editingValue || defaultFormValues,
	});

	useEffect(() => {
		if (editingIndex !== null) {
			setOpen(true);
		}
	}, [editingIndex]);

	// The 'values' object is now correctly typed thanks to the new schema
	function onSubmit(values: z.infer<typeof customValueSchema>) {
		// Now, if typeCase is 'number', values.value will already BE a number.
		// No manual parsing needed!
		console.log("Submitted Values:", values);

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
			// Reset the form to its default state when closing
			form.reset(defaultFormValues);
		}
	};

	const handleAddClick = () => {
		setEditingIndex(null);
		// Reset the form to ensure it's clean for a new entry
		form.reset(defaultFormValues);
		setOpen(true);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<Button
				className={`cursor-pointer text-[16px] ${className}`}
				onClick={handleAddClick}
			>
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
						{/* The form structure remains the same! */}
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							{/* FormField for nameCase */}
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

							{/* FormField for description */}
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

							{/* FormField for typeCase */}
							<FormField
								control={form.control}
								name="typeCase"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xl">Type Case</FormLabel>
										<Select
											onValueChange={(value) => {
												field.onChange(value);
												// Optional: reset the 'value' field when type changes
												form.setValue("value", "");
											}}
											value={field.value} // Use value instead of defaultValue
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select type case" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{/* Assuming DATA_TYPES contains "string", "number", etc. */}
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

							{/* FormField for value */}
							<FormField
								control={form.control}
								name="value"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xl">Value</FormLabel>
										<FormControl>
											{/* You can even conditionally render a different input type! */}
											{form.watch("typeCase") === "boolean" ? (
												<Select
													onValueChange={(val) =>
														field.onChange(val === "true")
													}
													value={String(field.value)}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select true or false" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="true">True</SelectItem>
														<SelectItem value="false">False</SelectItem>
													</SelectContent>
												</Select>
											) : (
												<Input
													placeholder="Value"
													{...field}
													// The value from the form state needs to be a string for the input
													value={String(field.value ?? "")}
												/>
											)}
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="w-full flex items-center justify-end">
								{/* --- IMPROVEMENT: Dynamic button text --- */}
								<Button type="submit" className="cursor-pointer">
									{editingIndex !== null ? "Update Value" : "Create Value"}
								</Button>
							</div>
						</form>
					</Form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};
