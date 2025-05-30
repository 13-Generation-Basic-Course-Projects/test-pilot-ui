// components/project-form.tsx
"use client";
import { ProjectFormProps, NewProjectPayload, ProjectItem } from "@/types"; // Import NewProjectPayload and ProjectItem
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { FolderPlusIcon } from "lucide-react";
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
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const ProjectForm = ({
	mode,
	initialData,
	isOpen,
	onOpenChange,
	onProjectCreated,
	onProjectUpdated,
}: ProjectFormProps) => {
	const [openCreated, setOpenCreated] = useState(false);

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

	async function onSubmit(values: z.infer<typeof projectFormSchema>) {
		if (mode === "create") {
			// Simulate API call for creating a new project
			const newProject: ProjectItem = {
				id: crypto.randomUUID(), // Generate a unique ID
				title: values.projectName,
				description: values.projectDescription,
				creationDate: new Date().toLocaleDateString("en-US"), // Set current date
				userAvatarUrl: "/profile-img.png", // Default avatar for new projects
			};
			console.log("New project created:", newProject);
			if (onProjectCreated) {
				onProjectCreated(newProject);
				setOpenCreated((prev) => !prev);
			}
		} else if (mode === "edit" && initialData) {
			// Simulate API call for updating an existing project
			const updatedProject: ProjectItem = {
				...initialData,
				title: values.projectName,
				description: values.projectDescription,
			};
			console.log("Project updated:", updatedProject);
			if (onProjectUpdated) {
				onProjectUpdated(updatedProject);
			}
		}

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
				<div className="w-full flex items-center justify-end gap-4">
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
					<Button type="submit">Submit</Button>
				</div>
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
		<Dialog open={openCreated} onOpenChange={setOpenCreated}>
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
