"use client";

import * as React from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { projectsData } from "@/lib/constants";

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
import { Input } from "./ui/input";

const endpointMethods = [
	{
		value: "GET",
		label: "GET",
	},
	{
		value: "POST",
		label: "POST",
	},
	{
		value: "PUT",
		label: "PUT",
	},
	{
		value: "PATCH",
		label: "PATCH",
	},
	{
		value: "DELETE",
		label: "DELETE",
	},
];

export function EndpointDropdownUrl({
	requestId: endpointId,
}: {
	projectId: string;
	requestId: string;
}) {
	const [open, setOpen] = React.useState(false);

	const endpoints = projectsData.flatMap((project) =>
		project.collections.flatMap((collection) =>
			collection.endpoints.filter((endpoint) => endpoint.id === endpointId)
		)
	);

	const endpoint = endpoints[0];

	const [value, setValue] = React.useState(endpoint?.method || "GET");

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
									endpointMethods.find((item) => item.value === value)?.label ||
										""
								)}`}
							>
								{endpointMethods.find((item) => item.value === value)?.label}
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
							<CommandList>
								<CommandGroup>
									{endpointMethods.map((method) => (
										<CommandItem
											key={method.value}
											value={method.value}
											onSelect={() => {
												setValue(method.value);
												setOpen(false);
											}}
										>
											<span className={getMethodColor(method.label)}>
												{method.label}
											</span>
											<Check
												className={cn(
													"ml-auto",
													value === method.value ? "opacity-100" : "opacity-0"
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
					className="h-[40px] rounded-l-none md:text-lg"
					placeholder="http://..."
				/>
			</div>
			<Button className="cursor-pointer">Send</Button>
		</div>
	);
}
