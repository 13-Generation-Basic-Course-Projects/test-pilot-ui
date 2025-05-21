"use client";
import { ProjectFormProps } from "@/types/projectType";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { FolderPlusIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import z from "zod";
import { projectFormSchema } from "@/lib/zodSchema";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";

const ProjectForm = ({
	mode,
	initialData,
	isOpen,
	onOpenChange,
}: ProjectFormProps) => {
	const form = useForm<z.infer<typeof projectFormSchema>>({
		resolver: zodResolver(projectFormSchema),
		defaultValues: {
			projectName: initialData?.title || "",
			projectDescription: initialData?.description || "",
		},
	});

	useEffect(() => {
		if (mode === "edit" && initialData) {
			form.reset({
				projectName: initialData.title || "",
				projectDescription: initialData.description || "",
			});
		} else if (mode === "create") {
			form.reset({
				projectName: "",
				projectDescription: "",
			});
		}
	}, [mode, initialData, form]);

	// **  Update and Create with Endpoint
	function onSubmit(values: z.infer<typeof projectFormSchema>) {
		console.log(values);
		if (onOpenChange) {
			onOpenChange(false);
		}
	}

	const formContent = (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="projectName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Project Name</FormLabel>
							<FormControl>
								<Input placeholder="Enter project name" {...field} />
							</FormControl>
							<FormDescription>
								This is the name of your project.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="projectDescription"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Project Description</FormLabel>
							<FormControl>
								<Input placeholder="Describe your project" {...field} />
							</FormControl>
							<FormDescription>Provide a brief description.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
				{mode === "edit" && onOpenChange && (
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
						className="ml-2"
					>
						Cancel
					</Button>
				)}
			</form>
		</Form>
	);

	if (mode === "edit") {
		return (
			<Dialog open={isOpen} onOpenChange={onOpenChange}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							<p className="text-2xl text-center mb-6">Edit existing project</p>
						</DialogTitle>
					</DialogHeader>
					{formContent}
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="cursor-pointer">
					<FolderPlusIcon className="mr-2 h-4 w-4" />
					New Project
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						<p className="text-2xl text-center mb-6">Create a new project</p>
					</DialogTitle>
				</DialogHeader>
				{formContent}
			</DialogContent>
		</Dialog>
	);
};

export default ProjectForm;
