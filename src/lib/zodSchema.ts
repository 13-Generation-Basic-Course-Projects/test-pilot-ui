import { z } from "zod";

export const projectFormSchema = z.object({
	projectName: z.string().min(1, { message: "Project name is required." }),
	projectDescription: z
		.string()
		.min(1, { message: "Project description is required." }),
});

export const collectionFormSchema = z.object({
	collectionName: z
		.string()
		.min(1, { message: "Collection name is required." }),
});
