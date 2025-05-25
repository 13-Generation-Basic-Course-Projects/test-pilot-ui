import React from "react";
import EditProfile from "./edit-profile-setting";
import Image from "next/image";

export default function ProfileSetting() {
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
						src="/profile.png"
						alt="Profile"
						className="w-20 h-20  rounded-full object-cover"
						width={20}
						height={20}
					/>
					<div>
						<p className="text-lg font-semibold text-gray-900">Testing pilot</p>
						<p className="text-md text-gray-400 font-medium">
							testingpilot@gmail.com
						</p>
					</div>
				</div>
				<EditProfile />
			</div>

			{/* Detail Rows */}
			<div className="space-y-12 max-w-3xl ml-25">
				<div className="flex">
					<div className="w-40 font-semibold text-gray-900">Username</div>
					<div className="text-gray-700">Teb Yuma</div>
				</div>
				<div className="flex">
					<div className="w-40 font-semibold text-gray-900">Email</div>
					<div className="text-gray-700">yuma123@gmail.com</div>
				</div>
				<div className="flex">
					<div className="w-40 font-semibold text-gray-900">Password</div>
					<div className="text-gray-700">********</div>
				</div>
			</div>
		</div>
	);
}
