"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Tabs,
	TabsContent,
	TabsListV2,
	TabsTriggerV2,
} from "@/components/ui/tabs";
import { Check, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
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
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const frameworks = [
	{ value: "no-auth", label: "No auth" },
	{ value: "basic-auth", label: "Basic auth" },
	{ value: "JWT", label: "JWT" },
];

export function ApiRequestContentHeader() {
	const [isOpen, setIsOpen] = useState(false);
	const [value, setValue] = useState("no-auth");
	const [token, setToken] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [rows, setRows] = useState([{ variable: "Key", value: "value" }]);
	const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

	const handleAddRow = () => {
		setRows([...rows, { variable: "", value: "" }]);
	};

	const handleChange = (
		index: number,
		field: "variable" | "value",
		newValue: string
	) => {
		const updatedRows = [...rows];
		updatedRows[index][field] = newValue;
		setRows(updatedRows);
	};

	const handleDeleteRow = () => {
		if (deleteIndex !== null) {
			setRows(rows.filter((_, i) => i !== deleteIndex));
			setDeleteIndex(null);
		}
	};

	return (
		<div className="w-full mx-auto mt-10 bg-white space-y-5">
			<p className="text-xl">Header</p>

			<Tabs defaultValue="authorization-type" className="w-full space-y-5">
				<TabsListV2 className="grid w-[400px] grid-cols-2">
					<TabsTriggerV2
						value="authorization-type"
						className="text-[15px] w-fit"
					>
						Authorization Type
					</TabsTriggerV2>
					<TabsTriggerV2 value="manual" className="text-[15px] w-fit">
						Manual
					</TabsTriggerV2>
				</TabsListV2>

				{/* The content for the first tab now has its own spacing */}
				<TabsContent value="authorization-type" className="space-y-5">
					{/* The Popover is now used for selection only */}
					<Popover open={isOpen} onOpenChange={setIsOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								aria-expanded={isOpen}
								className="w-fit justify-between text-[#006FEE]"
							>
								{value
									? frameworks.find((f) => f.value === value)?.label
									: "No auth"}
								{isOpen ? (
									<ChevronUp className="ml-2 h-5 w-5 shrink-0" />
								) : (
									<ChevronDown className="ml-2 h-5 w-5 shrink-0" />
								)}
							</Button>
						</PopoverTrigger>

						{/* Popover content is now just the selection list */}
						<PopoverContent className="w-[250px] p-0">
							<Command>
								<CommandList>
									<CommandEmpty>No framework found.</CommandEmpty>
									<CommandGroup>
										{frameworks.map((framework) => (
											<CommandItem
												key={framework.value}
												value={framework.value}
												onSelect={(currentValue) => {
													setValue(currentValue);
													setIsOpen(false); // Close the popover on selection
												}}
											>
												{framework.label}
												<Check
													className={cn(
														"ml-auto",
														value === framework.value
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

					{/* These input fields now render outside and below the Popover, in the main page flow */}
					{value === "basic-auth" && (
						<div className="space-y-4 max-w-md">
							<div className="grid w-full items-center gap-1.5">
								<Label htmlFor="username">Username</Label>
								<Input
									id="username"
									type="text"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									placeholder="Enter username"
								/>
							</div>
							<div className="grid w-full items-center gap-1.5">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Enter password"
								/>
							</div>
						</div>
					)}

					{value === "JWT" && (
						<div className="space-y-4 max-w-md">
							<div className="grid w-full items-center gap-1.5">
								<Label htmlFor="jwt-token">Token</Label>
								<Input
									id="jwt-token"
									type="text"
									value={token}
									onChange={(e) => setToken(e.target.value)}
									placeholder="Enter JWT token"
								/>
							</div>
						</div>
					)}
				</TabsContent>

				<TabsContent value="manual">
					<TableV2>
						<TableHeader>
							<TableRowV2>
								<TableHeadV2 className="border-r text-sm">Key</TableHeadV2>
								<TableHeadV2 className="border-r text-sm">Value</TableHeadV2>
								<TableHeadV2 className="text-sm ">Action</TableHeadV2>
							</TableRowV2>
						</TableHeader>

						<TableBody>
							{rows.map((row, index) => (
								<TableRow key={index}>
									<TableCell className="border-r">
										<input
											type="text"
											value={row.variable}
											onChange={(e) =>
												handleChange(index, "variable", e.target.value)
											}
											className="w-full py-1 px-2 text-sm border border-transparent focus:outline-none focus:border-gray-300 bg-transparent"
											placeholder="Enter key"
										/>
									</TableCell>
									<TableCell className="border-r">
										<input
											type="text"
											value={row.value}
											onChange={(e) =>
												handleChange(index, "value", e.target.value)
											}
											className="w-full py-1 px-2 text-sm border border-transparent focus:outline-none focus:border-gray-300 bg-transparent"
											placeholder="Enter value"
										/>
									</TableCell>
									<TableCell>
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<button onClick={() => setDeleteIndex(index)}>
													<Trash2
														className="text-[#E2001A] cursor-pointer"
														width={20}
													/>
												</button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>
														Are you absolutely sure?
													</AlertDialogTitle>
													<AlertDialogDescription>
														This action cannot be undone. This will permanently
														delete your header.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel
														onClick={() => setDeleteIndex(null)}
													>
														Cancel
													</AlertDialogCancel>
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
								className="cursor-pointer hover:bg-muted"
							>
								<TableCell colSpan={3} className="text-sm text-gray-500 py-3">
									+ Add
								</TableCell>
							</TableRow>
						</TableBody>
					</TableV2>
				</TabsContent>
			</Tabs>
		</div>
	);
}
