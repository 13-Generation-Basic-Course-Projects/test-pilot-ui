"use client";

import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItemV2,
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
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/action/auth-action";
import { getUserProfileService } from "@/service/user-service";
import { InviteToProject } from "./invite-to-project";

export const DropdownProfile = () => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    profileImage: "",
  });

  const router = useRouter();
  const pathname = usePathname();

  const isProjectDetailPage =
    pathname.startsWith("/project/") && pathname.split("/").length === 3;

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfileService();
      setProfile(data);
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex items-center gap-4">
      {isProjectDetailPage && <InviteToProject urlProject={pathname} />}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={
                profile.profileImage && profile.profileImage.trim() !== ""
                  ? profile.profileImage
                  : "/profile.png"
              }
              alt="profile"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-48" align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => router.push("/profile")}
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              Profile Setting
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItemV2
            className="text-red-600 cursor-pointer"
            onClick={() => setShowLogoutDialog(true)}
          >
            <LogOut className="text-red-600 mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItemV2>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Dialog */}
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
              <AlertDialogAction type="submit">Logout</AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
