"use client";

import { useActionState, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GithubIcon from "@/components/icons/github";
import GoogleIcon from "@/components/icons/google";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { signUpAction } from "@/action/auth-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRegister } from "@/store/email-register-slice";
import { signIn } from "next-auth/react"; // Import signIn for social login
import { GITHUB_LOGIN } from "@/lib/constants"; // Assuming you have this constant

export function RegisterForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	// The component now wraps a <div>
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();
	const [state, formAction] = useActionState(signUpAction, {
		message: "",
		success: false,
	});
	const { setRegisteredEmail } = useRegister();
	const [emailInputValue, setEmailInputValue] = useState<string>("");

	useEffect(() => {
		if (state.message) {
			if (state.success) {
				if (emailInputValue) {
					setRegisteredEmail(emailInputValue);
					toast.success(state.message);
					router.push("/verify-otp-confirm");
				}
			} else {
				toast.error(state.message);
			}
		}
	}, [state, emailInputValue, router, setRegisteredEmail]);

	return (
		// The main container is now a <div>
		<div className={cn("flex flex-col gap-8 mb-10", className)} {...props}>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold ">Create an account</h1>
				<p className="text-balance text-sm text-[#94A3B8]">
					Enter your credentials below to create an account
				</p>
			</div>

			{/* Social Buttons (now outside the form) */}
			<div className="flex justify-between items-center gap-8">
				<Button
					type="button" // Add type="button"
					variant="outline"
					className="flex items-center justify-center w-full flex-1 cursor-pointer"
					onClick={() => router.push(GITHUB_LOGIN)} // Assuming this is your GitHub flow
				>
					<GithubIcon />
					GitHub
				</Button>
				<Button
					type="button" // Add type="button"
					variant="outline"
					className="flex items-center justify-center w-full flex-1 cursor-pointer"
					onClick={() => signIn("google")} // Use NextAuth's signIn for Google
				>
					<GoogleIcon />
					Google
				</Button>
			</div>

			{/* Divider */}
			<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
				<span className="relative z-10 bg-background px-6 text-muted-foreground uppercase">
					Or continue with
				</span>
			</div>

			{/* The <form> tag now only wraps the fields and submit button */}
			<form action={formAction} className="grid gap-6">
				<div className="grid gap-2">
					<Label htmlFor="name" className="text-[#34302B]">
						Name
					</Label>
					<Input
						id="name"
						type="text"
						name="name"
						placeholder="name"
						required
						className="text-[#94A3B8]"
					/>
				</div>

				<div className="grid gap-2">
					<Label htmlFor="email" className="text-[#34302B]">
						Email Address
					</Label>
					<Input
						id="email"
						type="email"
						name="email"
						placeholder="example@gmail.com"
						required
						className="text-[#94A3B8]"
						value={emailInputValue}
						onChange={(e) => setEmailInputValue(e.target.value)}
					/>
				</div>

				<div className="grid gap-2 relative">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						name="password"
						type={showPassword ? "text" : "password"}
						required
						className="pr-10"
					/>
					<button
						type="button"
						onClick={() => setShowPassword((prev) => !prev)}
						className="absolute right-3 top-[30px] text-muted-foreground"
					>
						{showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
					</button>
				</div>

				<Button type="submit" className="w-full">
					Register
				</Button>
			</form>

			{/* Sign in link */}
			<div className="text-center text-sm text-[#94A3B8]">
				Already have an account ?{" "}
				<Link href="/login" className="text-[#0973DC]">
					Login
				</Link>
			</div>
		</div>
	);
}
