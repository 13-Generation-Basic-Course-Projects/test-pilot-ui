"use client";

import {
	Check,
	ChevronDown,
	ChevronUp,
	CodeXml,
	Eye,
	Loader2,
	X,
} from "lucide-react";
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
import { getAllProjectVariableAction } from "@/action/project-variable-action";
import { useApiBodyStore } from "@/store/body-api-slice";
import { Badge } from "./ui/badge";
import { ResponseView } from "./response-view";
import { useParamsApiStore } from "@/store/params-api-slice";
import { useHeaderStore } from "@/store/header-slice"; // ❗️ 1. IMPORT THE GLOBAL HEADER STORE

const endpointMethods = [
	{ value: "GET", label: "GET" },
	{ value: "POST", label: "POST" },
	{ value: "PUT", label: "PUT" },
	{ value: "PATCH", label: "PATCH" },
	{ value: "DELETE", label: "DELETE" },
];

const replaceEnvVariablesInUrl = (
	url: string,
	variables: { variable: string; value: string }[]
) => {
	let resolvedUrl = url;
	variables.forEach((v) => {
		const regex = new RegExp(`\\[\\[${v.variable}\\]\\]`, "gi");
		resolvedUrl = resolvedUrl.replace(regex, v.value);
	});
	return { resolvedUrl };
};

const replacePathParams = (
	url: string,
	pathVariables: { key: string; value: string }[]
) => {
	let resolvedUrl = url;
	pathVariables.forEach((param) => {
		if (param.key) {
			const regex = new RegExp(`\\{${param.key}\\}`, "g");
			resolvedUrl = resolvedUrl.replace(regex, param.value);
		}
	});
	return resolvedUrl;
};

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
	const [resolvedUrl, setResolvedUrl] = useState("");
	const [variables, setVariables] = useState<
		{ variable: string; value: string }[]
	>([]);
	const [isPending, startTransition] = useTransition();
	const [apiResponse, setApiResponse] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isResponsePanelOpen, setIsResponsePanelOpen] = useState(false);

	const { setUrl, setMethod } = useRequestStore();
	const { apiBodyRows } = useApiBodyStore();
	const { pathVariables } = useParamsApiStore();
	const { headers } = useHeaderStore(); // ❗️ 2. GET THE HEADERS FROM THE STORE
	const endpoint = request.find((ep) => ep.id === endpointId);

	useEffect(() => {
		getAllProjectVariableAction(projectId)
			.then(setVariables)
			.catch((error) => toast.error("Failed to load project variables."));
	}, [projectId]);

	useEffect(() => {
		if (endpoint) {
			setCurrentMethod(endpoint.method);
			setCurrentUrl(endpoint.details?.url || "");
		}
	}, [endpoint]);

	useEffect(() => {
		const { resolvedUrl: urlWithEnvVars } = replaceEnvVariablesInUrl(
			currentUrl,
			variables
		);
		const finalResolvedUrl = replacePathParams(urlWithEnvVars, pathVariables);

		setResolvedUrl(finalResolvedUrl);
		setUrl(finalResolvedUrl);
	}, [currentUrl, variables, pathVariables, setUrl]);

	useEffect(() => {
		if (currentMethod) {
			setMethod(currentMethod);
		}
	}, [currentMethod, setMethod]);

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

	const handleSendRequest = async () => {
		setIsLoading(true);
		setApiResponse(null);
		setError(null);
		setIsResponsePanelOpen(true);

		const requestBody = apiBodyRows.reduce((acc, r) => {
			if (r.id) {
				acc[r.id] = r.value;
			}
			return acc;
		}, {} as Record<string, any>);

		// ❗️ 3. INITIALIZE HEADERS WITH THE VALUES FROM THE GLOBAL STORE
		const requestHeaders: Record<string, string> = { ...headers };

		if (
			!["GET", "DELETE"].includes(currentMethod || "") &&
			Object.keys(requestBody).length > 0 &&
			!requestHeaders["Content-Type"]
		) {
			requestHeaders["Content-Type"] = "application/json";
		}

		console.log("🚀 Sending Request:", {
			method: currentMethod || "GET",
			url: resolvedUrl,
			headers: requestHeaders,
			body: requestBody,
		});

		const startTime = Date.now();
		try {
			const response = await fetch(resolvedUrl, {
				method: currentMethod || "GET",
				headers: requestHeaders, // ❗️ 4. PASS THE CORRECT HEADERS
				body:
					["GET", "DELETE"].includes(currentMethod || "") ||
					Object.keys(requestBody).length === 0
						? undefined
						: JSON.stringify(requestBody),
			});
			const endTime = Date.now();

			const responseHeaders: Record<string, string> = {};
			response.headers.forEach((value, key) => {
				responseHeaders[key] = value;
			});

			const contentType = response.headers.get("content-type");
			let responseBody;
			if (contentType?.includes("application/json")) {
				responseBody = await response.json();
			} else {
				responseBody = await response.text();
			}

			const responseSize = new TextEncoder().encode(
				JSON.stringify(responseBody)
			).length;

			setApiResponse({
				status: response.status,
				statusText: response.statusText,
				headers: responseHeaders,
				body: responseBody,
				duration: endTime - startTime,
				size: responseSize,
			});
		} catch (err: any) {
			setError(
				err.message ||
					"Request failed. Check the URL or console for more details."
			);
		} finally {
			setIsLoading(false);
		}
	};

	const getStatusColor = (status: number) => {
		if (status >= 200 && status < 300) return "bg-green-500";
		if (status >= 400) return "bg-red-500";
		return "bg-gray-500";
	};

	return (
		<>
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
							placeholder="[[baseURL]]/users"
							value={currentUrl}
							onChange={(e) => setCurrentUrl(e.target.value)}
							onBlur={() => handleSave({ url: currentUrl })}
						/>
					</div>
					<div className="flex items-center gap-2">
						<Button
							className="cursor-pointer"
							onClick={handleSendRequest}
							disabled={isLoading}
						>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Send
						</Button>
						{apiResponse && !isResponsePanelOpen && (
							<Button
								variant="secondary"
								onClick={() => setIsResponsePanelOpen(true)}
							>
								<Eye className="mr-2 h-4 w-4" />
								Show Response
							</Button>
						)}
						<Sheet>
							<SheetTrigger asChild>
								<Button
									variant="outline"
									className="cursor-pointer"
									disabled={isPending}
								>
									<CodeXml className="h-4 w-4" />
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

			{isResponsePanelOpen && (
				<div className="fixed bottom-0 left-0 right-0 h-2/3 z-20 bg-background border-t shadow-2xl flex flex-col">
					<header className="flex items-center justify-between p-3 border-b">
						<div className="flex items-center gap-4">
							{isLoading ? (
								<Badge variant="outline">
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Processing...
								</Badge>
							) : apiResponse ? (
								<>
									<Badge variant="outline">
										Status:{" "}
										<span
											className={`ml-1.5 w-2.5 h-2.5 rounded-full inline-block ${getStatusColor(
												apiResponse.status
											)}`}
										></span>
										<span className="ml-1.5">
											{apiResponse.status} {apiResponse.statusText}
										</span>
									</Badge>
									<Badge variant="outline">
										Time:{" "}
										<span className="ml-1 font-semibold">
											{apiResponse.duration} ms
										</span>
									</Badge>
									<Badge variant="outline">
										Size:{" "}
										<span className="ml-1 font-semibold">
											{apiResponse.size} B
										</span>
									</Badge>
								</>
							) : error ? (
								<Badge variant="destructive">Error</Badge>
							) : null}
						</div>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsResponsePanelOpen(false)}
						>
							<X className="h-5 w-5" />
						</Button>
					</header>
					<main className="flex-grow overflow-auto p-4">
						{error && <p className="text-destructive break-words">{error}</p>}
						{apiResponse && <ResponseView response={apiResponse} />}
					</main>
				</div>
			)}
		</>
	);
}
