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
