"use client";

import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import { getAllPredefinedAction } from "@/action/pre-defined-action";
import { usePathname } from "next/navigation";
import { createCustomTestCaseAction } from "@/action/custom-test-case-action";
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

export const CustomValueForm: React.FC<CustomValueFormProps> = ({
	onAddCustomValue,
	onEditCustomValue,
	editingIndex,
	editingValue,
	setEditingIndex,
}) => {
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof customValueSchema>>({
		resolver: zodResolver(customValueSchema),
		defaultValues: {
			nameCase: "",
			typeCase: "",
			value: "",
		},
	});

	const pathname = usePathname();

	useEffect(() => {
		if (editingValue) {
			form.reset(editingValue);
			setOpen(true);
		}
	}, [editingValue, form]);

	async function onSubmit(values: z.infer<typeof customValueSchema>) {
		console.log("Starting submission, isSubmitting:", isSubmitting);
		setIsSubmitting(true);
		console.log("Set isSubmitting to true");

		try {
			if (editingIndex !== null) {
				await onEditCustomValue(values, editingIndex);
				setEditingIndex(null);
			} else {
				await onAddCustomValue(values);
				toast.success("Path variable saved.");
			}
		} catch (error) {
			if (editingIndex === null) {
				toast.error("Path variable could not be saved.");
				console.error(error);
			}
		} finally {
			console.log("Resetting isSubmitting to false");
			setIsSubmitting(false);
			form.reset();
			setOpen(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="cursor-pointer">Add Custom</Button>
			</DialogTrigger>
			<DialogContent className="p-8 px-12">
				<DialogHeader>
					<DialogTitle>
						<p className="text-2xl text-center mb-4">Create custom value</p>
					</DialogTitle>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="nameCase"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name Case</FormLabel>
										<FormControl>
											<Input placeholder="My Phone" {...field} />
										</FormControl>
										<FormDescription>
											Enter your name case for test case
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="typeCase"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Type Case</FormLabel>
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
										<FormDescription>Select your type case</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="value"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Value</FormLabel>
										<FormControl>
											<Input placeholder="Value or Regex" {...field} />
										</FormControl>
										<FormDescription>
											Enter your value or regex for test case
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="w-full flex items-center justify-end">
								<Button
									type="submit"
									className="cursor-pointer flex items-center gap-2"
									disabled={isSubmitting}
								>
									{isSubmitting && (
										<span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
									)}
									{isSubmitting ? "Submitting..." : "Submit"}
								</Button>
							</div>
						</form>
					</Form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};
