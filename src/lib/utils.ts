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
