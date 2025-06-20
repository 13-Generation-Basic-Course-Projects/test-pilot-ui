import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { SubpathSegments } from "./subpath-segments";
import { DropdownProfile } from "./drop-down-profile";
import { auth } from "@/auth";


export const NavbarComponent = async ({
	className,
	...props
}: React.ComponentPropsWithoutRef<"nav">) => {
	const session = await auth();

	return (
		<nav className={cn("border-b-1 py-2 px-6", className)} {...props}>
			<div className="flex justify-between gap-2 items-center">
				<SubpathSegments />
				{session?.user ? (
					<>
						<DropdownProfile />
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
