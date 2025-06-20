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
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { updateRequestUrlAndMethodAction } from "@/action/request-action";
import { useRequestStore } from "@/store/request-url-slice";

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

	// ✨ 1. Get the `setMethod` function from the store as well
	const { setUrl, setMethod } = useRequestStore();

	const endpoint = request.find((ep) => ep.id === endpointId);

	// This effect correctly populates the local state from props
	useEffect(() => {
		if (endpoint) {
			setCurrentMethod(endpoint.method);
			setCurrentUrl(endpoint.details?.url || "");
		}
	}, [endpoint]);

	// This effect correctly syncs the local URL with the store
	useEffect(() => {
		setUrl(currentUrl);
	}, [currentUrl, setUrl]); // Dependency array best practice

	// ✨ 2. Add a new useEffect to sync the local method with the store
	// This is the missing piece that fixes the bug.
	useEffect(() => {
		if (currentMethod) {
			setMethod(currentMethod);
		}
	}, [currentMethod, setMethod]); // Dependency array best practice

	const handleSave = (values: { url?: string; method?: string }) => {
		if (!endpoint) return;

		const newUrl = values.url ?? currentUrl;
		const newMethod = values.method ?? currentMethod;

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
						onBlur={() => handleSave({ url: currentUrl })}
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
		</div>
	);
}
