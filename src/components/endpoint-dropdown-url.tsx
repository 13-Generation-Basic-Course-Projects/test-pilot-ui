"use client";

import * as React from "react";
import { Check, ChevronDown, ChevronUp, CodeXml } from "lucide-react";
// Remove: import { projectsData } from "@/lib/constants"; // We'll get data from localStorage

import { cn, getMethodColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Sheet,
	SheetContentV2,
	SheetHeader,
	SheetTitleV2,
	SheetTrigger,
} from "@/components/ui/sheet";

import { Input } from "./ui/input";
import CodeSnippet from "./code-snippet/code-snippet";
import { useRequestStore } from "@/store/request-url-slice";
import { useEffect } from "react";
import type { Project, Endpoint, CollectionItem } from "@/types"; // Ensure these types are correctly defined

const endpointMethods = [
	{ value: "GET", label: "GET" },
	{ value: "POST", label: "POST" },
	{ value: "PUT", label: "PUT" },
	{ value: "PATCH", label: "PATCH" },
	{ value: "DELETE", label: "DELETE" },
];

export function EndpointDropdownUrl({
	projectId,
	requestId,
}: {
	projectId: string;
	requestId: string;
}) {
	const [open, setOpen] = React.useState(false);
	const { method, url, setMethod, setUrl } = useRequestStore();
	const [localEndpoint, setLocalEndpoint] = React.useState<
		Endpoint | null | undefined
	>(null);

	useEffect(() => {
		// Read collectionsData from localStorage
		const savedCollectionsJSON = localStorage.getItem("collectionsData");
		// Optionally read openCollections if needed, though it's not used in this component's current logic
		// const savedOpenCollectionsJSON = localStorage.getItem("openCollections");

		let foundEndpoint: Endpoint | null | undefined = null;

		if (savedCollectionsJSON) {
			try {
				const allProjects = JSON.parse(savedCollectionsJSON) as Project[];
				const currentProject = allProjects.find((p) => p.id === projectId);
				if (currentProject) {
					for (const collection of currentProject.collections) {
						const ep = collection.endpoints.find((e) => e.id === requestId);
						if (ep) {
							foundEndpoint = ep;
							break;
						}
					}
				}
			} catch (error) {
				console.error(
					"Error parsing collectionsData from localStorage in EndpointDropdownUrl:",
					error
				);
				foundEndpoint = null; // Reset on error
			}
		}
		setLocalEndpoint(foundEndpoint);

		if (foundEndpoint) {
			setMethod(foundEndpoint.method);
			setUrl(
				foundEndpoint.url || foundEndpoint.value || foundEndpoint.path || ""
			);
		} else {
			// If endpoint not found in localStorage data (e.g., new or error),
			// useRequestStore will retain its current values or defaults.
			// You might want to explicitly set defaults here if needed.
			// For example, if navigating to a new unsaved request:
			// setMethod("GET");
			// setUrl("");
		}

		// If you were to use openCollections:
		// if (savedOpenCollectionsJSON) {
		// try {
		// const openCollectionsData = JSON.parse(savedOpenCollectionsJSON);
		// console.log("Open collections data in EndpointDropdownUrl:", openCollectionsData);
		// Process openCollectionsData if this component needed it
		// } catch (error) {
		// console.error("Error parsing openCollections from localStorage:", error);
		// }
		// }
	}, [projectId, requestId, setMethod, setUrl]); // Re-run if IDs change

	return (
		<div className="flex items-center gap-4">
			<div className="flex items-center flex-1">
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={open}
							className="w-[150px] h-[40px] justify-between rounded-r-none"
						>
							<span
								className={`${getMethodColor(
									method // Display method from useRequestStore
								)}`}
							>
								{endpointMethods.find((item) => item.value === method)?.label ||
									method ||
									"GET"}
							</span>
							{open ? (
								<ChevronUp className="opacity-50" />
							) : (
								<ChevronDown className="opacity-50" />
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[200px] p-0">
						<Command>
							<CommandList className="w-full">
								<CommandGroup>
									{endpointMethods.map((item) => (
										<CommandItem
											key={item.value}
											value={item.value}
											onSelect={() => {
												setMethod(item.value);
												// If method changes, you might want to update the actual endpoint data
												// in localStorage via a function passed from context or a global action.
												// For now, this just updates the local request store.
												setOpen(false);
											}}
										>
											<span className={getMethodColor(item.label)}>
												{item.label}
											</span>
											<Check
												className={cn(
													"ml-auto",
													method === item.value ? "opacity-100" : "opacity-0"
												)}
											/>
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
				<Input
					className="h-[40px] rounded-l-none md:text-sm"
					placeholder="Enter request URL"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
				/>
			</div>
			<div className="flex items-center gap-2">
				<Button className="cursor-pointer">Send</Button>
				<Sheet>
					<SheetTrigger asChild>
						<Button className="cursor-pointer">
							<CodeXml />
						</Button>
					</SheetTrigger>
					<SheetContentV2>
						<SheetHeader>
							<SheetTitleV2>Generated Code Snippet</SheetTitleV2>{" "}
							{/* Updated title */}
							<CodeSnippet />
						</SheetHeader>
					</SheetContentV2>
				</Sheet>
			</div>
		</div>
	);
}
