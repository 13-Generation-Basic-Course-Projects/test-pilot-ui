"use client";

import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
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
} from "./ui/select";
import { DATA_TYPES } from "@/lib/constants";

export const CustomValueForm = () => {
	const form = useForm<z.infer<typeof customValueSchema>>({
		resolver: zodResolver(customValueSchema),
		defaultValues: {
			nameCase: "",
			typeCase: "",
			value: "",
			description: "",
		},
	});

	function onSubmit(values: z.infer<typeof customValueSchema>) {
		console.log(values);
	}
	return (
		<Dialog>
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
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea placeholder="description..." {...field} />
										</FormControl>
										<FormDescription>
											Enter your description for test case
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
								<Button type="submit">Submit</Button>
							</div>
						</form>
					</Form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};
