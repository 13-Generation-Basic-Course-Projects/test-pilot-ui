"use client";
import React, { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { LogOut, Settings } from "lucide-react";
import {usePathname, useRouter} from "next/navigation";
import { signOut } from "@/auth";
import { logout } from "@/action/auth-action";
import {InviteToProject} from "@/components/invite-to-projecct";

export const DropdownProfile = () => {
	const [showLogoutDialog, setShowLogoutDialog] = useState(false);
	const router = useRouter();
	const pathname = usePathname()

	const  urlProject = pathname.split("/")[2]

	return (
		<div className="flex items-center gap-4">
			<InviteToProject urlProject={urlProject}/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Image
						src="/profile.png"
						alt="profile"
						width={40}
						height={40}
						className="rounded-full cursor-pointer"
					/>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-48" align="end">
					<DropdownMenuGroup>
						<DropdownMenuItem onClick={() => router.push("/profile")}>
							<Settings className="mr-2 h-4 w-4" />
							Profile Setting
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="text-red-600 cursor-pointer"
						onClick={() => setShowLogoutDialog(true)}
					>
						<LogOut className="text-red-600 mr-2 h-4 w-4" />
						Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Alert Dialog */}
			<AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
				<AlertDialogContent className="w-[350px] p-8">
					<AlertDialogHeader>
						<div className="flex justify-center mb-4">
							<Image
								src="/logout_image.png"
								alt="Logout Icon"
								className="rounded-xl border-4 border-white"
								width={200}
								height={200}
							/>
						</div>
						<AlertDialogTitle className="text-center text-xl">
							Are you sure you want to logout?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-center text-sm text-muted-foreground">
							You’ll be redirected to the homepage after logout.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<form action={logout}>
							<AlertDialogAction type="submit">logout</AlertDialogAction>
						</form>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};
