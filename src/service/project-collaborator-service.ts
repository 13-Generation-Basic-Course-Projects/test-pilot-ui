import { fetchAPI } from "@/lib/api";

import { projectCollaboratorType } from "@/types/ProjectCollaboratorType";
import { API_BASE_URL } from "@/lib/static";

interface InviteData {
	projectId: string;
	collaboratorEmail: string;
}

export async function projectCollaboratorService(data: InviteData) {
	const res = await fetchAPI<projectCollaboratorType>(
		`${API_BASE_URL}/collaborators/invite
`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				projectId: data.projectId,
				collaboratorEmail: data.collaboratorEmail,
			}),
		}
	);

	return res.payload;
}

export async function verifyCollaboratorToken(token: string) {
	const authToken = localStorage.getItem("auth-token");

	const res = await fetchAPI<projectCollaboratorType>(
		`${API_BASE_URL}/collaborators/verify?token=${encodeURIComponent(token)}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authToken}`,
			},
		}
	);

	return res.payload;
}

export async function getInviteCollaboratorService(projectId: string) {
	const res = await fetchAPI<projectCollaboratorType>(
		`${API_BASE_URL}/collaborators/by-project/${encodeURIComponent(projectId)}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	return res.payload;
}

export async function deleteInviteProjectService(id: string) {
	const res = await fetchAPI<projectCollaboratorType>(
		`${API_BASE_URL}/collaborators/${encodeURIComponent(id)}`,
		{
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	return res.message;
}
