"use server";

import { getAllPredefinedService } from "@/service/pre-defined-service";

export const getAllPredefinedAction = async () => {
	const data = await getAllPredefinedService();

	return data;
};
