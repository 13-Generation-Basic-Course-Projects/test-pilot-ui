import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { DATA_TYPES, DataType } from "@/lib/constants";
import { Separator } from "./ui/separator";
import { CustomValueForm } from "./custom-value-form";
import { Edit, Trash2 } from "lucide-react";

interface RequestParam {
	name: string;
	value: string;
	type: DataType;
}

export const CustomValue = (): React.JSX.Element => {
	const requestParams: RequestParam[] = [
		{
			name: "My Phone Number",
			value: "^(\\+0?1\\s)?\\(?\\d{3}\\)?[\\s.-]\\d{3}[\\s.-]\\d{4}$",
			type: "String",
		},
	];

	return (
		<div className="flex flex-col items-end gap-5 relative self-stretch w-full">
			<div className="inline-flex items-start justify-end gap-5 relative">
				<Select>
					<SelectTrigger className="w-[204px] px-3 py-2 bg-[#ffffff] rounded-md border border-solid border-[#cbd5e1]">
						<SelectValue
							placeholder="Select to filter"
							className="text-slate-400"
						/>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All</SelectItem>
						<Separator />
						{DATA_TYPES.map((type) => (
							<SelectItem key={type} value={type.toLowerCase()}>
								{type}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<CustomValueForm />
			</div>

			<Card className="w-full border border-solid border-slate-200 p-0">
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow className="border-b border-slate-200">
								<TableHead className="h-12 text-left pl-6 font-medium text-slate-500 text-sm border-r border-slate-200">
									Name
								</TableHead>
								<TableHead className="h-12 text-left pl-6 font-medium text-slate-500 text-sm border-r border-slate-200">
									Value
								</TableHead>
								<TableHead className="h-12 text-left pl-6 font-medium text-slate-500 text-sm border-r border-slate-200">
									Type
								</TableHead>
								<TableHead className="h-12 text-left pl-6 font-medium text-slate-500 text-sm">
									Action
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{requestParams.map((param, index) => (
								<TableRow key={index} className="border-b border-slate-200">
									<TableCell className="h-12 pl-6 font-body text-[#34302b] border-r border-slate-200">
										{param.name}
									</TableCell>
									<TableCell className="h-12 pl-6 font-detail text-slate-500 border-r border-slate-200">
										{param.value}
									</TableCell>
									<TableCell className="h-12 pl-6 font-detail text-slate-500 border-r border-slate-200">
										<Badge
											variant="outline"
											className="bg-[#ffffff] text-[#006fee] font-medium text-xs"
										>
											{param.type}
										</Badge>
									</TableCell>
									<TableCell className="h-12 pl-6 flex gap-4 items-center">
										<Trash2 className="text-red-500 cursor-pointer" />
										<Edit className="cursor-pointer" />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
};
