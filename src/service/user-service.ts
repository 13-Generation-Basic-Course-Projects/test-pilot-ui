import {fetchAPI} from "@/lib/api";
import {USER_ENDPOINT} from "@/lib/static";
import {UserProfileType} from "@/types/user-profile-type";

export async function userUpdateService(data: { name: string; email: string }) {
    const res = await fetchAPI<UserProfileType>(`${USER_ENDPOINT}/update/profile-info`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    console.log("getProfile",res)

    return res.payload;
}

export async function uploadProfileImageService(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetchAPI<UserProfileType>(`${USER_ENDPOINT}/upload/profile-image`, {
        method: "PUT",
        body: formData,
    });


    return res.payload.profileImage;
}
export async function getUserProfileService(): Promise<{
    username: string;
    email: string;
    profileImage: string;
}> {
    const res = await fetchAPI<UserProfileType>(`${USER_ENDPOINT}/profile-info`, {
        method: "GET",
    });

    return {
        username: res.payload.name,
        email: res.payload.email,
        profileImage: res.payload.profileImage,
    };

}









