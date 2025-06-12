"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { FolderPlusIcon } from "lucide-react";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { projectFormSchema } from "@/lib/zodSchema";
import { ProjectFormProps, ProjectItem } from "@/types";
import {
	createProjectAction,
	updateProjectByIdAction,
} from "@/action/project-action";

const ProjectForm = ({
	mode,
	initialData,
	isOpen,
	onOpenChange,
	onProjectCreated,
	onProjectUpdated,
}: ProjectFormProps) => {
	const [dialogOpen, setDialogOpen] = useState(false);

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
				projectName: initialData.title,
				projectDescription: initialData.description,
			});
		} else {
			form.reset({
				projectName: "",
				projectDescription: "",
			});
		}
	}, [mode, initialData, form]);

	const onSubmit = async (values: z.infer<typeof projectFormSchema>) => {
		try {
			if (mode === "create") {
				const newProject = await createProjectAction({
					projectName: values.projectName,
					projectDescription: values.projectDescription,
				});

				if (newProject && onProjectCreated) {
					onProjectCreated(newProject);
					toast.success("Project created successfully!");
				}
				setDialogOpen(false);
			} else if (mode === "edit" && initialData) {
				const updatedProject = await updateProjectByIdAction(initialData.id, {
					projectName: values.projectName,
					projectDescription: values.projectDescription,
				});

				if (updatedProject && onProjectUpdated) {
					// console.log("Update project", updatedProject);
					onProjectUpdated(updatedProject);
					toast.success("Project updated successfully!");
				}

				if (onOpenChange) {
					onOpenChange(false);
				}
			}
		} catch (error) {
			// console.error("Project action failed:", error);
			toast.error(
				`Failed to ${
					mode === "create" ? "create" : "update"
				} project. Please try again.`
			);
		}
	};

	const formContent = (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="projectName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Project Name</FormLabel>
							<FormControl>
								<Input placeholder="Enter project name" {...field} />
							</FormControl>
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
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex justify-end gap-2">
					{mode === "edit" && onOpenChange && (
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
					)}
					<Button type="submit" className="cursor-pointer">
						Submit
					</Button>
				</div>
			</form>
		</Form>
	);

	if (mode === "edit") {
		return (
			<Dialog open={isOpen} onOpenChange={onOpenChange}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="text-xl text-center">
							Edit Project
						</DialogTitle>
					</DialogHeader>
					{formContent}
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button onClick={() => setDialogOpen(true)} className="cursor-pointer">
					<FolderPlusIcon className="mr-2 h-4 w-4" />
					New Project
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-xl text-center">
						Create a New Project
					</DialogTitle>
				</DialogHeader>
				{formContent}
			</DialogContent>
		</Dialog>
	);
};

export default ProjectForm;
