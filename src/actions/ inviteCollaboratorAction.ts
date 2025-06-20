"use server";

import {deleteInviteProjectService, projectCollaboratorService} from "@/service/project-collaborator-service";


export async function inviteCollaboratorAction(projectId: string, email: string) {
    if (!projectId || !email) {
        throw new Error("Project ID and email are required");
    }

    const invited = await projectCollaboratorService({ projectId, collaboratorEmail: email });
    return invited;
}



export async function deleteInviteProjectAction(id: string): Promise<string> {
    const res = await deleteInviteProjectService(id);
    console.log("Deleting project:", res);
    return res;
}
