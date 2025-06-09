"use server";

import {getUserProfileService, uploadProfileImageService, userUpdateService} from "@/service/user-service";


export const handleUserUpdate = async (
    data: { name: string; email: string; profileImage: string },
) => {
    try {
        const updated = await userUpdateService(data);
        return updated;
    } catch (e) {
        console.error("handleUserUpdate error:", e);
        throw e;
    }
};

export const handleUploadProfileImage = async (
    file: File
) => {
    try {
        const upload = await uploadProfileImageService(file);
        return upload;
    } catch (e) {
        console.error("handleUploadProfileImage error:", e);
        return null;
    }
};


