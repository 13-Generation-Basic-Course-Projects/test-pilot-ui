"use client";
import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { MethodBadge } from "./method-badge";

const dates = [
	{
		date: "20 May 2025, 19:00 PM",
		method: <MethodBadge method="PUT" />,
		endPoint: "api/v1/habits/habit-id",
		status: (
			<div className="flex justify-between max-w-[150px]">
				<p className="text-[#17C964]">Passed</p>
				<div className="w-fit border border-[#E2E8F0] rounded-md px-[15px] text-[#17C964]">
					200
				</div>
			</div>
		),
	},
	{
		date: "20 May 2025, 19:00 PM",
		method: <MethodBadge method="PUT" />,
		endPoint: "api/v1/habits/habit-id",
		status: (
			<div className="flex justify-between max-w-[150px]">
				<p className="text-[#EF4444]">Failed</p>
				<div className="w-fit border border-[#E2E8F0] rounded-md px-[15px] text-[#17C964]">
					200
				</div>
			</div>
		),
	},
	{
		date: "20 May 2025, 19:00 PM",
		method: <MethodBadge method="PUT" />,
		endPoint: "api/v1/habits/habit-id",
		status: (
			<div className="flex justify-between max-w-[150px]">
				<p className="text-[#EF4444]">Failed</p>
				<div className="w-fit border border-[#E2E8F0] rounded-md px-[15px] text-[#EF4444]">
					500
				</div>
			</div>
		),
	},
	{
		date: <p className="text-[#94A3B8]">20 May 2025, 19:00 PM</p>,
		method: <MethodBadge method="PUT" />,
		endPoint: <p className="text-[#94A3B8]">api/v1/habits/habit-id</p>,
		status: <p className="text-[#94A3B8]">Pending</p>,
	},
];

export function MonitoringData() {
	const [activeRow, setActiveRow] = useState<number | null>(null);

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Date</TableHead>
					<TableHead>Method</TableHead>
					<TableHead>Endpoint</TableHead>
					<TableHead>Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{dates.map((dateItem, index) => (
					<TableRow
						key={index}
						onClick={() => setActiveRow(index)}
						className={`py-5 cursor-pointer ${
							activeRow === index ? "bg-[#F1F5F9]" : ""
						}`}
					>
						<TableCell className="py-5">{dateItem.date}</TableCell>
						<TableCell className="py-5">{dateItem.method}</TableCell>
						<TableCell className="py-5">{dateItem.endPoint}</TableCell>
						<TableCell className="py-5">{dateItem.status}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
