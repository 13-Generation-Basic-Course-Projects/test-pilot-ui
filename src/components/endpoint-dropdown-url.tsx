"use client";

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
import { Input } from "@/components/ui/input";
import CodeSnippet from "./code-snippet/code-snippet";
import { EndpointItem } from "@/types";
import { useEffect, useState, useRef, useTransition } from "react";
import { toast } from "sonner";
import { updateRequestUrlAndMethodAction } from "@/action/request-action";

const endpointMethods = [
	{ value: "GET", label: "GET" },
	{ value: "POST", label: "POST" },
	{ value: "PUT", label: "PUT" },
	{ value: "PATCH", label: "PATCH" },
	{ value: "DELETE", label: "DELETE" },
];

export function EndpointDropdownUrl({
	projectId,
	collectionId,
	requestId: endpointId,
	request,
}: {
	projectId: string;
	collectionId: string;
	requestId: string;
	request: EndpointItem[];
}) {
	const [open, setOpen] = useState(false);
	const [currentMethod, setCurrentMethod] = useState<string | undefined>("GET");
	const [currentUrl, setCurrentUrl] = useState("");
	const [isPending, startTransition] = useTransition();

	const endpoint = request.find((ep) => ep.id === endpointId);

	// This effect populates the form with the correct data when you navigate
	useEffect(() => {
		if (endpoint) {
			setCurrentMethod(endpoint.method);
			setCurrentUrl(endpoint.details?.url || "");
		}
	}, [endpoint]); // Runs whenever the endpoint prop changes

	// ✨ NEW ARCHITECTURE: An explicit save handler.
	// This function is called only when a user action occurs.
	const handleSave = (values: { url?: string; method?: string }) => {
		if (!endpoint) return;

		const newUrl = values.url ?? currentUrl;
		const newMethod = values.method ?? currentMethod;

		// Check if anything actually changed before saving.
		if (
			newUrl === (endpoint.details?.url || "") &&
			newMethod === endpoint.method
		) {
			return;
		}

		startTransition(async () => {
			try {
				await updateRequestUrlAndMethodAction({
					projectId,
					collectionId,
					requestId: endpoint.id,
					method: newMethod as string,
					url: newUrl,
				});
				toast.success("Request updated!");
			} catch (error) {
				toast.error("Failed to save changes.");
			}
		});
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-4">
				<div className="flex items-center flex-1">
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								className="w-[150px] h-[40px] justify-between rounded-r-none"
								// disabled={isPending}
							>
								<span className={getMethodColor(currentMethod || "GET")}>
									{currentMethod}
								</span>
								{open ? (
									<ChevronUp className="w-4 h-4 opacity-50" />
								) : (
									<ChevronDown className="w-4 h-4 opacity-50" />
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-[200px] p-0">
							<Command>
								<CommandList>
									<CommandGroup>
										{endpointMethods.map((item) => (
											<CommandItem
												key={item.value}
												value={item.value}
												onSelect={() => {
													// ✨ EXPLICIT ACTION: Set state and then call save.
													setCurrentMethod(item.value);
													handleSave({ method: item.value });
													setOpen(false);
												}}
											>
												<span className={getMethodColor(item.label)}>
													{item.label}
												</span>
												<Check
													className={cn(
														"ml-auto h-4 w-4",
														currentMethod === item.value
															? "opacity-100"
															: "opacity-0"
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
						placeholder="http://test-pilot/enter-request-url"
						value={currentUrl}
						onChange={(e) => setCurrentUrl(e.target.value)}
						// ✨ EXPLICIT ACTION: Save when the user clicks away from the input.
						onBlur={() => handleSave({ url: currentUrl })}
						// disabled={isPending}
					/>
				</div>
				<div className="flex items-center gap-2">
					<Button className="cursor-pointer" disabled={isPending}>
						Send
					</Button>
					<Sheet>
						<SheetTrigger asChild>
							<Button className="cursor-pointer" disabled={isPending}>
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
			{/* {isPending && (
				<p className="text-sm text-gray-500 self-start">Saving...</p>
			)} */}
		</div>
	);
}
