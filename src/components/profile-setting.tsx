"use client"
import React, { useState } from "react";
import Image from "next/image";
import Profile from "../../public/profile.png";
import EditProfile from "./profile/edit-profile-setting";
export default function ProfileSetting() {
	const [profile, setProfile] = useState({
		username: "Teb Yuma",
		email: "yuma123@gmail.com",
		password: "********",
	});

	const handleUpdateProfile = (updatedData: {
		username: string;
		email: string;
		password: string;
	}) => {
		setProfile(updatedData);
	};
	return (
		<div className="max-w-screen h-screen mx-auto mt-10 bg-white rounded-xl shadow p-8">
			{/* Header */}
			<div className=" border-b border-gray-200 mb-4">
				<h2 className="text-xl font-semibold text-gray-900 mb-8 ">
					Profile details
				</h2>
			</div>
			{/* Top Section */}
			<div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-8">
				<div className="flex items-center gap-5">
					<Image
						src={Profile}
						alt="Profile"
						className="w-20 h-20  rounded-full object-cover"
						width={20}
						height={20}
					/>
					<div>
						<p className="text-lg font-semibold text-gray-900">{profile.username}</p>
						<p className="text-md text-gray-400 font-medium">
							{profile.email}
						</p>
					</div>
				</div>
				<EditProfile  profile={profile} onSave={handleUpdateProfile}/>
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
	);
}
