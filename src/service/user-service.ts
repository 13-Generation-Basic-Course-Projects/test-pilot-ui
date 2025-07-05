import { fetchAPI } from "@/lib/api";
import { USER_ENDPOINT } from "@/lib/static";
import { UserProfileType } from "@/types/user-profile-type";
import { auth } from "@/auth";

export async function userUpdateService(data: { name: string; email: string }) {
	const res = await fetchAPI<UserProfileType>(
		`${USER_ENDPOINT}/update/profile-info`,
		{
			method: "PUT",
			body: JSON.stringify(data),
		}
	);

	return res.payload;
}

export async function uploadProfileImageService(file: File) {
	const allowedTypes = ["image/jpeg", "image/png"];

	if (!allowedTypes.includes(file.type)) {
		throw new Error("Only JPG and PNG image formats are allowed.");
	}

	const formData = new FormData();
	formData.append("file-name", file);

	const session = await auth();
	const token = session?.accessToken;

	const response = await fetch(`${USER_ENDPOINT}/upload/profile-image`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	});

	const res = await response.json();

	if (res.payload && res.payload.profileImage) {
		return res.payload.profileImage;
	}

	throw new Error(res.message || "Failed to upload profile image.");
}


export async function getUserProfileService(): Promise<{
	username: string;
	email: string;
	profileImage: string;
}> {
	const res = await fetchAPI<UserProfileType>(`${USER_ENDPOINT}/profile-info`, {
		method: "GET",
	});

	if (!res.payload) {
		throw new Error("User profile response payload is undefined");
	}

	return {
		username: res.payload.name,
		email: res.payload.email,
		profileImage: res.payload.profileImage,
	};
}
