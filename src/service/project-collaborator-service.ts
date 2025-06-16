import { fetchAPI } from "@/lib/api";

import { projectCollaboratorType } from "@/types/ProjectCollaboratorType";

interface InviteData {

    projectId: string;
    collaboratorEmail: string;
}

export async function projectCollaboratorService(data: InviteData) {


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
    const authToken = localStorage.getItem("auth-token");


    const res = await fetchAPI<projectCollaboratorType>(`http://localhost:8080/api/v1/collaborators/verify?token=${encodeURIComponent(token)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
    });

    console.log("Verify response:", res);

    return res.payload;
}

export async function getInviteCollaboratorService(projectId: string) {
    const res = await fetchAPI<projectCollaboratorType>(
        `http://localhost:8080/api/v1/collaborators/by-project/${encodeURIComponent(projectId)}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    console.log("InviteProject:", res);
    return res.payload;
}

export async function deleteInviteProjectService(id: string){
    const res = await fetchAPI<projectCollaboratorType>(
        `http://localhost:8080/api/v1/collaborators/${encodeURIComponent(id)}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        }
    );
    console.log("Deleting project:", res);
    return res.message;
}



