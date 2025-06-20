import { fetchAPI } from "@/lib/api";
import { HISTORY_ENDPOINT } from "@/lib/static";

export const getHistoryService = async (projectId: string) => {
	const data = await fetchAPI(`${HISTORY_ENDPOINT}/${projectId}`);

	console.log(data);

	return data;
};
