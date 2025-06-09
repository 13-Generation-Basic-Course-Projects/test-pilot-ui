import { fetchAPI } from "@/lib/api";
import { PREDEFINED_ENDPOINT } from "@/lib/static";
import { cache } from "react";

export const getAllPredefinedService = cache(async () => {
	const data = await fetchAPI(`${PREDEFINED_ENDPOINT}/predefined`);

	return data.payload;
});
