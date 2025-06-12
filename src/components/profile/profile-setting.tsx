"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { BreadcrumbProfile } from "../breadcrumb-profile";
import EditProfile from "../profile/edit-profile-setting";
import { handleUploadProfileImage, handleUserUpdate } from "@/action/user-action";
import { getUserProfileService } from "@/service/user-service";

export default function ProfileSetting() {
	const [profile, setProfile] = useState({
		username: "",
		email: "",
		password: "********",
		profileImage: "/default-image.png",
	});

	useEffect(() => {
		async function fetchProfile() {
			const userData = await getUserProfileService();
			if (userData) {
				setProfile({
					username: userData.username,
					email: userData.email,
					password: "********",
					profileImage: userData.profileImage || "/default-image.png",
				});
			}
		}
		fetchProfile();
	}, []);

	const handleUpdateProfile = async (updatedData: {
		username: string;
		email: string;
		password?: string;
		profileImage?: File | null;
	}) => {
		try {
			let profileImageUrl = profile.profileImage;


			if (updatedData.profileImage) {
				const uploadedImageUrl = await handleUploadProfileImage(updatedData.profileImage);
				if (uploadedImageUrl) {
					profileImageUrl = uploadedImageUrl;
				}
			}


			await handleUserUpdate({
				name: updatedData.username,
				email: updatedData.email,
				profileImage: profileImageUrl,
			});

			// Update state locally
			setProfile((prev) => ({
				...prev,
				username: updatedData.username,
				email: updatedData.email,
				profileImage: profileImageUrl,
			}));
		} catch (error) {
			console.error("Failed to update profile:", error);
		}
	};


	return (
		<div className="min-w-screen">
			<div className="p-8">
				<BreadcrumbProfile />
			</div>
			<div className="max-h-screen rounded-xl p-8 mt-10 ms-32 me-32 border-1">
				<div className="border-b border-gray-200 mb-4">
					<h2 className="text-xl font-semibold text-gray-900 mb-8">Profile details</h2>
				</div>

				<div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-8">
					<div className="flex items-center gap-5">
						<Image
							src={
								profile.profileImage.startsWith("http://")
									? profile.profileImage.replace("http://", "https://")
									: profile.profileImage
							}
							alt="Profile"
							width={80}
							height={80}
							className="w-20 h-20 rounded-full object-cover"
						/>
						<div>
							<p className="text-lg font-semibold text-gray-900">{profile.username}</p>
							<p className="text-md text-gray-400 font-medium">{profile.email}</p>
						</div>
					</div>
					<EditProfile profile={profile} onSave={handleUpdateProfile} />
				</div>

				<div className="space-y-12 max-w-3xl ml-25">
					<div className="flex">
						<div className="w-40 font-semibold text-gray-900">Username</div>
						<div className="text-gray-700">{profile.username}</div>
					</div>
					<div className="flex">
						<div className="w-40 font-semibold text-gray-900">Email</div>
						<div className="text-gray-700">{profile.email}</div>
					</div>
					<div className="flex">
						<div className="w-40 font-semibold text-gray-900">Password</div>
						<div className="text-gray-700">{profile.password}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
