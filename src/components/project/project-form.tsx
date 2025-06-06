// components/project-form.tsx
"use client";
import { ProjectFormProps, NewProjectPayload, ProjectItem } from "@/types";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { FolderPlusIcon, Loader2 } from "lucide-react";
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
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof projectFormSchema>>({
		resolver: zodResolver(projectFormSchema),
		defaultValues: {
			projectName: initialData?.title || "",
			projectDescription: initialData?.description || "",
		},
	});

	useEffect(() => {
		if (isOpen || openCreated) {
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
		}
	}, [mode, initialData, form, isOpen, openCreated]);

	async function onSubmit(values: z.infer<typeof projectFormSchema>) {
		setIsSubmitting(true);

		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 1000));

		if (mode === "create") {
			const newProjectData = {
				// Use a different name to avoid confusion with ProjectItem type if it differs
				id: crypto.randomUUID(),
				title: values.projectName,
				description: values.projectDescription,
				creationDate: new Date().toLocaleDateString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
				}),
				userAvatarUrl: "/profile-img.png",
			};

			// This is the project shell that includes the collections
			const newProjectWithCollections = {
				...newProjectData,
				collections: [], // Start with empty collections
			};

			// --- Start: Save to Local Storage ---
			try {
				// 1. Update the master list of projects (for the dashboard)
				const masterListJSON = localStorage.getItem("projects");
				const masterList = masterListJSON ? JSON.parse(masterListJSON) : [];
				masterList.push(newProjectData); // Add only the metadata to the master list
				localStorage.setItem("projects", JSON.stringify(masterList));

				// 2. Create the separate, detailed entry for this new project
				const projectKey = `project-data-${newProjectData.id}`;
				localStorage.setItem(
					projectKey,
					JSON.stringify(newProjectWithCollections)
				);

				console.log(
					`Project metadata and detailed entry for ${projectKey} saved.`
				);
			} catch (error) {
				console.error("Failed to save project to local storage:", error);
			}
			// --- End: Updated Local Storage Logic ---

			if (onProjectCreated) {
				onProjectCreated(newProjectData as ProjectItem); // Pass the metadata item
				setOpenCreated(false);
			}
		} else if (mode === "edit" && initialData) {
			const updatedProject: ProjectItem = {
				...initialData,
				title: values.projectName,
				description: values.projectDescription,
			};

			// Here you would also update local storage if needed
			try {
				const existingProjectsJSON = localStorage.getItem("projects");
				const existingProjects: ProjectItem[] = existingProjectsJSON
					? JSON.parse(existingProjectsJSON)
					: [];

				const projectIndex = existingProjects.findIndex(
					(p) => p.id === updatedProject.id
				);

				if (projectIndex !== -1) {
					existingProjects[projectIndex] = updatedProject;
					localStorage.setItem("projects", JSON.stringify(existingProjects));
					console.log("Project updated in local storage:", updatedProject);
				}
			} catch (error) {
				console.error("Failed to update project in local storage:", error);
			}

			if (onProjectUpdated) {
				onProjectUpdated(updatedProject);
			}
		}

		setIsSubmitting(false);
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
					<Button
						type="button"
						variant="outline"
						onClick={() =>
							mode === "edit" ? onOpenChange?.(false) : setOpenCreated(false)
						}
						className="ml-2"
					>
						Cancel
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Please wait
							</>
						) : (
							"Submit"
						)}
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
