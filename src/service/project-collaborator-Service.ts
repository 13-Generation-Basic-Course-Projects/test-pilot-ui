import { fetchAPI } from "@/lib/api";
import { API_BASE_URL } from "@/lib/static";
import { projectCollaboratorType } from "@/types/ProjectCollaboratorType";

interface InviteData {
    projectId: string;
    collaboratorEmail: string;
}

export async function projectCollaboratorService(data: InviteData) {
    console.log("Sending invite to", data.collaboratorEmail, "for project", data.projectId);

    const res = await fetchAPI<projectCollaboratorType>(`http://localhost:8080/api/v1/collaborators/invite
`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            projectId: data.projectId,
            collaboratorEmail: data.collaboratorEmail,
        }),
    });

    console.log("Invite response:", res);

    return res.payload;
}

export async function verifyCollaboratorToken(token: string) {
    console.log("Verifying token:", token);

    const res = await fetchAPI<projectCollaboratorType>(`http://localhost:8080/api/v1/collaborators/verify?token=${encodeURIComponent(token)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    console.log("Verify response:", res);

    return res.payload;
}

