"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import Logo from "./icons/logo";
import { cn } from "@/lib/utils";
import BreadcrumbNavbar from "./breadcrumb-navbar";
import { useProjectPath } from "@/hooks/use-project-path";
export const NavbarComponent = ({
	className,
	...props
}: React.ComponentPropsWithoutRef<"nav">) => {
	const isLogin = true;
	const { subpathSegments, hasSubpathSegments } = useProjectPath();

	return (
		<nav className={cn("border-b-1 py-2 px-6", className)} {...props}>
			<div className="flex justify-between gap-2 items-center">
				{hasSubpathSegments ? (
					<BreadcrumbNavbar params={subpathSegments} />
				) : (
					<Logo />
				)}
				{isLogin ? (
					<div>
						<Image src="/profile.png" alt="profile" width={40} height={40} />
					</div>
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
