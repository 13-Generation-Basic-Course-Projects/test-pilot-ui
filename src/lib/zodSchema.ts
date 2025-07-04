import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
  // Optional: Include callbackUrl if needed for redirects
  // callbackUrl: z.string().optional(),
});

export const projectFormSchema = z.object({
  projectName: z.string().min(1, { message: "Project name is required." }),
  projectDescription: z
    .string()
    .min(1, { message: "Project description is required." }),
});

export const collectionFormSchema = z.object({
  collectionName: z
    .string()
    .refine((val) => val.trim().length >= 3, {
      message: "Collection name must be at least 3 non-space characters.",
    })
    .refine((val) => !val.startsWith(" "), {
      message: "Collection name cannot start with a space and empty.",
    }),
});

export const customValueSchema = z.object({
  nameCase: z.string().min(1, { message: "Name case is required." }),
  typeCase: z.string().min(1, { message: "Value is required." }),
  value: z.string().min(1, { message: "Value is required." }),
});
