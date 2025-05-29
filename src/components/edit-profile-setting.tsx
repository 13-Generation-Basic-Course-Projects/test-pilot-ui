"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface EditProfileProps {
	profile: {
		username: string;
		email: string;
		password: string;
	};
	onSave: (data: { username: string; email: string; password: string }) => void;
}

export default function EditProfile({ profile, onSave }: EditProfileProps) {
	const [open, setOpen] = useState(false);
	const [username, setUsername] = useState(profile.username);
	const [email, setEmail] = useState(profile.email);
	const [password, setPassword] = useState(profile.password);

	useEffect(() => {
		if (open) {
			setUsername(profile.username);
			setEmail(profile.email);
			setPassword(profile.password);
		}
	}, [open, profile]);

	const handleCancel = () => {
		setOpen(false);
	};

	const handleSave = () => {
		onSave({ username, email, password });
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">Edit Profile</Button>
			</DialogTrigger>
			<DialogContent
				className="p-0"
				onInteractOutside={(e) => e.preventDefault()}
			>
				<div className="relative bg-white rounded-xl shadow p-8">
					<DialogClose asChild>
						<button
							className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
							aria-label="Close"
						/>
					</DialogClose>

					<DialogHeader className="mb-8">
						<DialogTitle className="text-xl font-semibold text-center text-gray-900">
							Profile Details
						</DialogTitle>
					</DialogHeader>

					<div className="flex items-center pb-6 mb-8">
						<Image
							src="/profile.png"
							alt="Profile"
							className="w-20 h-20 rounded-full object-cover mr-5"
							width={20}
							height={20}
						/>
						<div>
							<p className="text-lg font-semibold text-gray-900">
								Testing Pilot
							</p>
							<p className="text-sm font-medium text-gray-500">
								testingpilot@gmail.com
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
						<div>
							<label className="block text-sm font-medium text-gray-600 mb-2">
								Username
							</label>
							<Input
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-600 mb-2">
								Email
							</label>
							<Input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-600 mb-2">
								Password
							</label>
							<Input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					</div>

					<DialogFooter className="flex justify-end gap-4">
						<Button variant="outline" type="button" onClick={handleCancel}>
							Cancel
						</Button>
						<Button type="button" onClick={handleSave}>
							Save Changes
						</Button>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
}
