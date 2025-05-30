"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import Logo from "./icons/logo";
import { cn } from "@/lib/utils";
import BreadcrumbNavbar from "./breadcrumb-navbar";
import { useProjectPath } from "@/hooks/use-project-path";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { useRouter } from "next/navigation";
import { LogOut, Settings } from "lucide-react";
import { useState } from "react";

export const NavbarComponent = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"nav">) => {
  const isLogin = true;
  const { subpathSegments, hasSubpathSegments } = useProjectPath();
  const router = useRouter();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <nav className={cn("border-b-1 py-2 px-6", className)} {...props}>
      <div className="flex justify-between gap-2 items-center">
        {hasSubpathSegments ? (
          <BreadcrumbNavbar params={subpathSegments} />
        ) : (
          <Logo />
        )}

        {isLogin ? (
          <>
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
            <AlertDialog
              open={showLogoutDialog}
              onOpenChange={setShowLogoutDialog}
            >
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
                  <AlertDialogAction onClick={handleLogout}>
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <div className="flex gap-4">
            <Button>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button variant="ghost">
              <Link href="/register">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
