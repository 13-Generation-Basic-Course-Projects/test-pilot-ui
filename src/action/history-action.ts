import { getHistoryService } from "@/service/history-service";

export const getHistoryAction = async (projectId: string) => {
	const data = await getHistoryService(projectId);

	return data;
};
