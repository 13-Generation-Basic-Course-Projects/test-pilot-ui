"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GithubIcon from "@/components/icons/github";
import GoogleIcon from "@/components/icons/google";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { signInAction, signInGithub } from "@/action/auth-action";
import { signIn } from "next-auth/react";
import { GITHUB_LOGIN } from "@/lib/constants";
import { githubLoginService } from "@/service/auth-service";

export function LoginForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"form">) {
	const searchParams = useSearchParams();
	const router = useRouter();
	useEffect(() => {
		const error = searchParams.get("error");
		const code = searchParams.get("code");
		if (error) {
			toast.error("Invalid credentials", {
				id: "login-credentials-id",
			});
		}

		if (code) {
			toast.success("Successfully login with github");
			(async () => {
				await signInGithub(code);
			})();
		}
	}, [searchParams]);
	const [showPassword, setShowPassword] = useState(false);

	return (
		<form
			className={cn("flex flex-col gap-8 mb-10", className)}
			action={signInAction}
			{...props}
		>
			{/* Header */}
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Login to your account</h1>
				<p className="text-balance text-sm text-[#94A3B8]">
					Click the button below to login via
				</p>
			</div>
			{/* Social Buttons */}
			<div className="flex justify-between items-center gap-8">
				<Button
					onClick={() => router.push(GITHUB_LOGIN)}
					variant="outline"
					className="flex items-center justify-center w-full flex-1 cursor-pointer"
				>
					<GithubIcon />
					GitHub
				</Button>
				<Button
					variant="outline"
					className="flex items-center justify-center w-full flex-1 cursor-pointer"
					onClick={() => signIn("google")}
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

			{/* Email & Password */}
			<div className="grid gap-6">
				<div className="grid gap-2">
					<Label htmlFor="email" className="text-[#34302B]">
						Email
					</Label>
					<Input
						id="email"
						type="email"
						name="email"
						placeholder="example@gmail.com"
						required
						className="text-[#94A3B8]"
					/>
				</div>

				{/* Password Field with Eye Icon */}
				<div className="grid gap-2 relative">
					<Label htmlFor="password" className="text-[#34302B]">
						Password
					</Label>
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
						aria-label={showPassword ? "Hide password" : "Show password"}
						aria-pressed={showPassword}
					>
						{showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
					</button>
					<button className="ml-auto text-sm underline-offset-4 hover:underline text-[#0973DC]">
						<Link href="/forgot-password">Forgot your password?</Link>
					</button>
				</div>

				<Button type="submit" className="w-full cursor-pointer">
					Login
				</Button>
			</div>

			{/* Sign up */}
			<div className="text-center text-sm text-[#737373]">
				Don't have an account?{" "}
				<Link href="/register" className="text-[#0973DC]">
					Sign up
				</Link>
			</div>
		</form>
	);
}
