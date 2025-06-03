import {fetchAPI} from "@/lib/api";
import {USER_ENDPOINT} from "@/lib/static";
import {UserProfileType} from "@/types/user-profile-type";

export async function userUpdateService(data: { name: string; email: string }) {
    const res = await fetchAPI<UserProfileType>(`${USER_ENDPOINT}/update/profile-info`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

    return res.data;
}

export async function uploadProfileImageService(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetchAPI(`${USER_ENDPOINT}/upload/profile-image`, {
        method: "POST",
        body: JSON.stringify(formData),

    });

    return res;
}





