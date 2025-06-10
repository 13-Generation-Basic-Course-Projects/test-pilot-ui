import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getMethodColor = (method: string) => {
	switch (method.toUpperCase()) {
		case "GET":
			return "text-[#17c964]";
		case "POST":
			return "text-[#f5a524]";
		case "PUT":
			return "text-[#006fee]";
		case "DELETE":
			return "text-[#f31260]";
		case "PATCH":
			return "text-[#7C3AED]";
		default:
			return "text-gray-500";
	}
};

export function getStatusBadgeColor(badgeStatus: "passed" | "failed") {
	return badgeStatus === "passed"
		? "text-[#17C964] bg-[#17C964]/10"
		: "text-[#EF4444] bg-[#EF4444]/10";
}

export function isValidJSON(jsonString: string): boolean {
	if (!jsonString.trim()) return false;
	try {
		JSON.parse(jsonString);
		return true;
	} catch {
		return false;
	}
}

export function formatReadableDate(dateString: string): string {
	const date = new Date(dateString);
	const options: Intl.DateTimeFormatOptions = {
		day: "numeric", // "6"
		month: "short", // "Jan"
		year: "numeric", // "2025"
		hour: "numeric", // "10"
		minute: "2-digit", // "15"
		hour12: true, // Use AM/PM
	};
	return new Intl.DateTimeFormat("en-US", options).format(date);
}

/**
 * A custom JSON stringifier that truncates long string values.
 * @param obj The object to stringify.
 * @param space The number of spaces for indentation.
 * @param limit The character limit for string values before truncation.
 * @returns A formatted JSON string with long values truncated.
 */
export const jsonStringifyWithTruncation = (
	obj: any,
	space: number = 2,
	limit: number = 256
) => {
	const replacer = (key: string, value: any) => {
		if (typeof value === "string" && value.length > limit) {
			return value.substring(0, limit) + "...";
		}
		return value;
	};
	return JSON.stringify(obj, replacer, space);
};
