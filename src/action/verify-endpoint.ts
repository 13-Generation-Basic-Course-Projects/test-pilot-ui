"use server";

import { verifyToken } from "@/service/share-link-service";

export async function verifyTokenAction(token: string) {
	try {
		const payload = await verifyToken(token);
		if (payload && Array.isArray(payload) && payload.length > 0) {
			const endpointDetails = payload[0];
			return {
				success: true,
				data: endpointDetails,
			};
		}
		return {
			success: false,
			error: "Invalid or expired token, or no endpoint details found",
		};
	} catch (err) {
		console.error("verifyTokenAction Error:", err);
		return {
			success: false,
		};
	}
}
