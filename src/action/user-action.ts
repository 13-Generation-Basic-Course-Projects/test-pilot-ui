"use server";

import {userUpdateService} from "@/service/user-service";

export const handleUserUpdate = async (
    data: { name: string; email: string },
) => {
    try {
        const updated = await userUpdateService(data);
        return updated;
    } catch (e) {
        console.error("handleUserUpdate error:", e);
        throw e;
    }
};
