"use client";

import React from "react";
import { getMethodColor } from "@/lib/utils";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | string;

export function MethodBadge({ method }: { method: Method }) {
	const colorClass = getMethodColor(method);
	return (
		<div
			className={`w-fit border border-[#E2E8F0] rounded-md px-[15px] ${colorClass}`}
		>
			{method}
		</div>
	);
}
interface MethodBadgeProps {
	method: string;
}

export function MethodBadgeV1({ method }: MethodBadgeProps) {
	const getMethodColor = (method: string) => {
		switch (method.toUpperCase()) {
			case "GET":
				return "bg-green-100 text-green-800 border-green-200";
			case "POST":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "PUT":
				return "bg-orange-100 text-orange-800 border-orange-200";
			case "PATCH":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "DELETE":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	return (
		<span
			className={`px-2 py-1 rounded-md text-xs font-medium border ${getMethodColor(
				method
			)}`}
		>
			{method.toUpperCase()}
		</span>
	);
}
