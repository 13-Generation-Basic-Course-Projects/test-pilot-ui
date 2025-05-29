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
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { Input } from "./ui/input";

const frameworks = [
	{ value: "no-auth", label: "No auth" },
	{ value: "basic-auth", label: "Basic auth" },
	{ value: "JWT", label: "JWT" },
];

export function ApiRequestContentHeader() {
	const [isOpen, setIsOpen] = useState(false);
	const [value, setValue] = useState("");
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
					<TabsTriggerV2 value="authorization-type">
						Authorization Type
					</TabsTriggerV2>
					<TabsTriggerV2 value="manual">Manual</TabsTriggerV2>
				</TabsListV2>

				<TabsContent value="authorization-type">
					<Collapsible open={isOpen} onOpenChange={setIsOpen}>
						<CollapsibleTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								aria-expanded={isOpen}
								className="w-1/7 justify-between text-[#006FEE]"
							>
								{value
									? frameworks.find((f) => f.value === value)?.label
									: "No auth"}
								{isOpen ? (
									<ChevronUp className="h-5 w-5" />
								) : (
									<ChevronDown className="h-5 w-5" />
								)}
							</Button>
						</CollapsibleTrigger>

						<CollapsibleContent className="mt-2">
							<Command>
								<CommandList>
									<CommandEmpty>No framework found.</CommandEmpty>
									<CommandGroup>
										{frameworks.map((framework) => (
											<CommandItem
												key={framework.value}
												value={framework.value}
												onSelect={(currentValue) => {
													setValue(currentValue === value ? "" : currentValue);
													setIsOpen(false);
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
						</CollapsibleContent>
						{value === "basic-auth" && (
							<div>
								<div className="mt-10 space-x-20 flex items-center w-1/2">
									<label className="block text-sm font-medium text-gray-700">
										Username
									</label>
									<Input
										type="text"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										placeholder="Enter username"
									/>
								</div>
								<div className="mt-10 space-x-20 flex items-center w-1/2">
									<label className="block text-sm font-medium text-gray-700">
										Password
									</label>
									<Input
										type="text"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Enter password"
									/>
								</div>
							</div>
						)}

						{value === "JWT" && (
							<div className="mt-10 space-x-20 flex items-center w-1/2">
								<label className="block text-sm font-medium text-gray-700">
									Token
								</label>
								<input
									type="text"
									value={token}
									onChange={(e) => setToken(e.target.value)}
									className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
									placeholder="Enter JWT token"
								/>
							</div>
						)}
					</Collapsible>
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
											className="w-full py-1 px-2 text-sm border border-transparent focus:outline-none focus:border-gray-300 text-[#94A3B8]"
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
											className="w-full py-1 px-2 text-sm border border-transparent focus:outline-none focus:border-gray-300 text-[#94A3B8]"
											placeholder="Enter value"
										/>
									</TableCell>
									<TableCell>
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Trash2
													className="text-[#E2001A] cursor-pointer"
													width={20}
													onClick={() => setDeleteIndex(index)}
												/>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>
														Are you absolutely sure?
													</AlertDialogTitle>
													<AlertDialogDescription>
														This action cannot be undone. This will permanently
														delete your endpoint
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
								<TableCell colSpan={3} className="text-sm text-[#94A3B8] py-3">
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
