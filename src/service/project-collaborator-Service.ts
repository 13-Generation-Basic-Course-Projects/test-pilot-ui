import { fetchAPI } from "@/lib/api";
import { API_BASE_URL } from "@/lib/static";
import { projectCollaboratorType } from "@/types/ProjectCollaboratorType";

interface InviteData {
    projectId: string;
    collaboratorEmail: string;
}

export async function projectCollaboratorService(data: InviteData) {
    console.log("Sending invite to", data.collaboratorEmail, "for project", data.projectId);

    const res = await fetchAPI<projectCollaboratorType>(`${API_BASE_URL}/collaborators/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            projectId: data.projectId,
            collaboratorEmail: data.collaboratorEmail,  // <-- Corrected key here
        }),
    });

    console.log("Invite response:", res);

    return res.payload;
}
