import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getMethodColor = (method: string) => {
	switch (method.toUpperCase()) {
		case "GET":
			return "text-[#006fee]";
		case "POST":
			return "text-[#17c964]";
		case "PUT":
			return "text-[#f5a524]";
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

// You can add this helper function to @/lib/utils.ts or at the top of your component file.

/**
 * Converts a stored test case value to its correct JavaScript data type.
 * @param value The value from the test case store (can be string or number).
 * @param type The type string from the test case store (e.g., "Number", "Boolean", "String").
 * @returns The value converted to the correct data type.
 */
export const convertCustomValue = (
	value: string | number,
	type: string
): string | number | boolean => {
	const lowerCaseType = type.toLowerCase();

	if (lowerCaseType === "number") {
		// If the type is 'number', attempt to parse it as a float.
		// parseFloat can handle both numbers (e.g., -1) and strings (e.g., "-1").
		// If parsing fails (e.g., for "abc"), it returns NaN. In that case, we fall back to the original value.
		const num = parseFloat(String(value));
		return isNaN(num) ? value : num;
	}

	if (lowerCaseType === "boolean") {
		// If the type is 'boolean', check for the string "true".
		// This handles the case where your form stores booleans as strings.
		if (String(value).toLowerCase() === "true") {
			return true;
		}
		if (String(value).toLowerCase() === "false") {
			return false;
		}
		// If it's something else, return the original value.
		return value;
	}

	// For any other type ('string', 'date', 'uuid', etc.), return the value as is.
	return value;
};

const now = new Date();

const day = now.toLocaleString("en-GB", { day: "2-digit" });
const month = now.toLocaleString("en-GB", { month: "short" });
const year = now.getFullYear();
const time = now.toLocaleString("en-US", {
	hour: "2-digit",
	minute: "2-digit",
	hour12: true,
});

export const formattedDateNow = `${day} ${month} ${year}, ${time}`;
export const formattedDateNoTime = `${day} ${month} ${year}`;
