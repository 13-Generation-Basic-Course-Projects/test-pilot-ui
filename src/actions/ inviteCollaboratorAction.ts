"use server";

import { projectCollaboratorService } from "@/service/project-collaborator-Service";

export async function inviteCollaboratorAction(projectId: string, email: string) {
    if (!projectId || !email) {
        throw new Error("Project ID and email are required");
    }

    const invited = await projectCollaboratorService({ projectId, collaboratorEmail: email });
    return invited;
}
