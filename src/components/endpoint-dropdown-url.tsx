"use client";

import * as React from "react";
import { Check, ChevronDown, ChevronUp, CodeXml } from "lucide-react";

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
import { useProjectStore } from "@/store/project-store"; // <-- Import the main project store

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

	// Get the specific action and the project data from the store
	const { project, updateEndpoint } = useProjectStore();

	// This store can be used for the temporary state of the URL input field
	const { url, setUrl } = useRequestStore();

	// Find the current endpoint from the central store's data
	const currentEndpoint = React.useMemo(() => {
		if (!project) return null;
		for (const collection of project.collections) {
			const ep = collection.endpoints.find((e) => e.id === requestId);
			if (ep) return ep;
		}
		return null;
	}, [project, requestId]);

	// Use the method from the central store as the source of truth
	const method = currentEndpoint?.method || "GET";

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
							<span className={`${getMethodColor(method)} text-[16px]`}>
								{method}
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
												setOpen(false);
												// Call the store action to update the method globally
												updateEndpoint(requestId, item.value);
											}}
										>
											<span
												className={`${getMethodColor(item.label)} text-[16px]`}
											>
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
					className="h-[40px] rounded-l-none md:text-[16px]"
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
							<SheetTitleV2>Generated Code Snippet</SheetTitleV2>
							<CodeSnippet />
						</SheetHeader>
					</SheetContentV2>
				</Sheet>
			</div>
		</div>
	);
}
