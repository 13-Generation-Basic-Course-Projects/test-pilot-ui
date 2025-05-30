"use client";
import React, { useState } from "react";
import Image from "next/image";
import { BreadcrumbProfile } from "../breadcrumb-profile";
import EditProfile from "../profile/edit-profile-setting";

export default function ProfileSetting() {
	const [profile, setProfile] = useState({
		username: "Teb Yuma",
		email: "yuma123@gmail.com",
		password: "********",
		imageUrl: "/profile-img.png",
	});

	const handleUpdateProfile = (updatedData: {
		username: string;
		email: string;
		password: string;
		image?: File | null;
	}) => {
		if (updatedData.image) {
			const imageUrl = URL.createObjectURL(updatedData.image);
			setProfile({
				username: updatedData.username,
				email: updatedData.email,
				password: updatedData.password,
				imageUrl: imageUrl,
			});
		} else {
			setProfile({
				username: updatedData.username,
				email: updatedData.email,
				password: updatedData.password,
				imageUrl: profile.imageUrl,
			});
		}
	};

	return (
		<div className="min-w-screen">
			<div className="p-8">
				<BreadcrumbProfile />
			</div>
			<div className="max-h-screen rounded-xl p-8 mt-10 ms-32 me-32 border-1">
				{/* Header */}
				<div className="border-b border-gray-200 mb-4">
					<h2 className="text-xl font-semibold text-gray-900 mb-8">
						Profile details
					</h2>
				</div>

				{/* Top Section */}
				<div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-8">
					<div className="flex items-center gap-5">
						<Image
							src={profile.imageUrl}
							alt="Profile"
							className="w-20 h-20 rounded-full object-cover"
							width={80}
							height={80}
						/>
						<div>
							<p className="text-lg font-semibold text-gray-900">
								{profile.username}
							</p>
							<p className="text-md text-gray-400 font-medium">
								{profile.email}
							</p>
						</div>
					</div>
					<EditProfile profile={profile} onSave={handleUpdateProfile} />
				</div>

				{/* Detail Rows */}
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
