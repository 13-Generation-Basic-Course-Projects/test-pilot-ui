"use client";

import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { PlusSquareIcon } from "lucide-react";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { collectionFormSchema } from "@/lib/zodSchema";
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

export const CollectionForm = ({
	onCollectionCreate,
}: {
	onCollectionCreate: (collectionName: string) => void;
}) => {
	const [open, setOpen] = useState(false);

	const form = useForm<z.infer<typeof collectionFormSchema>>({
		resolver: zodResolver(collectionFormSchema),
		defaultValues: {
			collectionName: "",
		},
	});
	function onSubmit(values: z.infer<typeof collectionFormSchema>) {
		onCollectionCreate(values.collectionName);
		setOpen((prev) => !prev);
		form.reset({
			collectionName: "",
		});
	}
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="bg-[#34302b] hover:bg-[#34302b]/90 cursor-pointer">
					<PlusSquareIcon className="w-6 h-6 mr-2" />
					Add Collection
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						<p className="text-2xl text-center mb-6">Create a new collection</p>
					</DialogTitle>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="collectionName"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel>Collection Name</FormLabel>
										<FormControl>
											<Input placeholder="Login..." {...field} />
										</FormControl>
										<FormDescription>
											Enter your collection name
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
