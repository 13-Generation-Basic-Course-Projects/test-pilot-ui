"use client";

import * as React from "react";
import { useState, useEffect, useTransition, useMemo } from "react";
import { toast } from "sonner";
import { Buffer } from "buffer";

// UI Components
import { Button } from "@/components/ui/button";
import {
	Tabs,
	TabsContent,
	TabsListV2,
	TabsTriggerV2,
} from "@/components/ui/tabs";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	TableV2,
	TableBody,
	TableCell,
	TableHeader,
	TableHeadV2,
	TableRow,
	TableRowV2,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

// Actions and Types
import {
	saveAllHeadersAction,
	HeaderRow,
} from "@/action/request-header-action";
import { EndpointItem } from "@/types";

const frameworks = [
	{ value: "no-auth", label: "No auth" },
	{ value: "basic-auth", label: "Basic auth" },
	{ value: "jwt", label: "JWT" },
];

export function ApiRequestContentHeader({
	requests,
	requestId,
}: {
	requests: EndpointItem[];
	requestId: string;
}) {
	// Local state holds the "draft" of user's changes for an instant UI response.
	const [isOpen, setIsOpen] = useState(false);
	const [authType, setAuthType] = useState("no-auth");
	const [token, setToken] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [manualRows, setManualRows] = useState<HeaderRow[]>([]);

	const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
	const [isSaving, startTransition] = useTransition();

	const currentRequest = useMemo(
		() => requests.find((req) => req.id === requestId),
		[requests, requestId]
	);

	// This effect hydrates the local state from the server data (props).
	useEffect(() => {
		if (!currentRequest?.details?.header) {
			setAuthType("no-auth");
			setUsername("");
			setPassword("");
			setToken("");
			setManualRows([]);
			return;
		}
		let headers: Record<string, any> = {};
		try {
			headers = JSON.parse(currentRequest.details.header);
		} catch (e) {
			console.error("Could not parse header JSON:", e);
		}

		const authHeader = headers["Authorization"] || headers["authorization"];
		if (authHeader?.startsWith("Basic ")) {
			setAuthType("basic-auth");
			try {
				const creds = Buffer.from(authHeader.split(" ")[1], "base64").toString(
					"ascii"
				);
				const [user, pass] = creds.split(":");
				setUsername(user || "");
				setPassword(pass || "");
			} catch (e) {
				setUsername("");
				setPassword("");
			}
		} else if (authHeader?.startsWith("Bearer ")) {
			setAuthType("jwt");
			setToken(authHeader.split(" ")[1] || "");
		} else {
			setAuthType("no-auth");
		}

		const currentManualHeaders = Object.entries(headers)
			.filter(([key]) => key.toLowerCase() !== "authorization")
			.map(([variable, value]) => ({ variable, value: String(value) }));
		setManualRows(currentManualHeaders);
	}, [currentRequest]);

	if (!currentRequest) {
		return (
			<div className="flex items-center justify-center h-40 text-muted-foreground">
				Select a request to manage its headers.
			</div>
		);
	}

	// This is the single, unified save handler. It merges state from both tabs.
	const handleSaveAllHeaders = () => {
		// Step A: Start with the manual headers from the local state
		const finalHeaders = manualRows.reduce((acc, row) => {
			if (row.variable.trim()) {
				acc[row.variable.trim()] = row.value;
			}
			return acc;
		}, {} as Record<string, string>);

		// Step B: Merge by adding or overwriting the Authorization header
		if (authType === "basic-auth") {
			const base64token = Buffer.from(`${username}:${password}`).toString(
				"base64"
			);
			finalHeaders["Authorization"] = `Basic ${base64token}`;
		} else if (authType === "jwt") {
			finalHeaders["Authorization"] = `Bearer ${token}`;
		} else {
			delete finalHeaders["Authorization"];
		}

		// Step C: Call the single backend action with the final, merged object
		startTransition(() => {
			toast.promise(saveAllHeadersAction(requestId, finalHeaders), {
				loading: "Saving all headers...",
				success: "Headers saved successfully.",
				error: "Failed to save headers.",
			});
		});
	};

	// These handlers correctly update the local state for an instant UI.
	const handleAuthTypeSelect = (newAuthType: string) => {
		setAuthType(newAuthType);
		setIsOpen(false);
	};
	const handleManualRowChange = (
		index: number,
		field: keyof HeaderRow,
		newValue: string
	) => {
		setManualRows((currentRows) =>
			currentRows.map((row, i) =>
				i === index ? { ...row, [field]: newValue } : row
			)
		);
	};
	const handleAddRow = () =>
		setManualRows([...manualRows, { variable: "", value: "" }]);
	const handleDeleteRow = () => {
		if (deleteIndex === null) return;
		setManualRows((currentRows) =>
			currentRows.filter((_, i) => i !== deleteIndex)
		);
		setDeleteIndex(null);
	};

	return (
		<div className="w-full mx-auto mt-10 bg-white space-y-5">
			<div className="flex justify-between items-center">
				<p className="text-xl">Header</p>
				<Button onClick={handleSaveAllHeaders} disabled={isSaving}>
					{isSaving ? "Saving..." : "Save Header Changes"}
				</Button>
			</div>
			<Tabs defaultValue="authorization-type" className="w-full space-y-5">
				<TabsListV2 className="grid w-[400px] grid-cols-2">
					<TabsTriggerV2 value="authorization-type">
						Authorization Type
					</TabsTriggerV2>
					<TabsTriggerV2 value="manual">Manual</TabsTriggerV2>
				</TabsListV2>
				<TabsContent value="authorization-type" className="space-y-5">
					<Popover open={isOpen} onOpenChange={setIsOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								className="w-fit justify-between text-[#006FEE]"
							>
								{frameworks.find((f) => f.value === authType)?.label ??
									"No auth"}
								<ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-[250px] p-0">
							<Command>
								<CommandList>
									<CommandGroup>
										{frameworks.map((framework) => (
											<CommandItem
												key={framework.value}
												value={framework.value}
												onSelect={handleAuthTypeSelect}
											>
												<Check
													className={cn(
														"mr-2 h-4 w-4",
														authType === framework.value
															? "opacity-100"
															: "opacity-0"
													)}
												/>
												{framework.label}
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
					{authType === "basic-auth" && (
						<div className="space-y-4 max-w-md">
							<div className="grid w-full items-center gap-1.5">
								<Label htmlFor="username">Username</Label>
								<Input
									id="username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									disabled={isSaving}
								/>
							</div>
							<div className="grid w-full items-center gap-1.5">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									disabled={isSaving}
								/>
							</div>
						</div>
					)}
					{authType === "jwt" && (
						<div className="space-y-4 max-w-md">
							<div className="grid w-full items-center gap-1.5">
								<Label htmlFor="jwt-token">Token</Label>
								<Input
									id="jwt-token"
									value={token}
									onChange={(e) => setToken(e.target.value)}
									disabled={isSaving}
								/>
							</div>
						</div>
					)}
				</TabsContent>
				<TabsContent value="manual">
					<TableV2>
						<TableHeader>
							<TableRowV2>
								<TableHeadV2>Key</TableHeadV2>
								<TableHeadV2>Value</TableHeadV2>
								<TableHeadV2>Action</TableHeadV2>
							</TableRowV2>
						</TableHeader>
						<TableBody>
							{manualRows.map((row, index) => (
								<TableRow key={index}>
									<TableCell>
										<Input
											value={row.variable}
											onChange={(e) =>
												handleManualRowChange(index, "variable", e.target.value)
											}
											className="h-10 border-transparent"
										/>
									</TableCell>
									<TableCell>
										<Input
											value={row.value}
											onChange={(e) =>
												handleManualRowChange(index, "value", e.target.value)
											}
											className="h-10 border-transparent"
										/>
									</TableCell>
									<TableCell>
										<AlertDialog
											onOpenChange={(open) => !open && setDeleteIndex(null)}
										>
											<AlertDialogTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => setDeleteIndex(index)}
												>
													<Trash2 className="text-red-500 w-4 h-4" />
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>Are you sure?</AlertDialogTitle>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<AlertDialogAction onClick={handleDeleteRow}>
														Delete
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</TableCell>
								</TableRow>
							))}
							<TableRow
								onClick={handleAddRow}
								className="cursor-pointer hover:bg-muted/50"
							>
								<TableCell colSpan={3} className="text-sm text-gray-500 py-3">
									+ Add Header
								</TableCell>
							</TableRow>
						</TableBody>
					</TableV2>
				</TabsContent>
			</Tabs>
		</div>
	);
}
