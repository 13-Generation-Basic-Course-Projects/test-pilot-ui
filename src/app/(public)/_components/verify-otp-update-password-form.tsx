"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react"; 
import Link from "next/link";
export function VerifyOtpUpdatePasswordForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"form">) {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	return (
		<form className={cn("flex flex-col gap-8 mb-10", className)} {...props}>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Enter New Password</h1>
				<p className="text-balance text-sm text-muted-foreground">
					Choose your new password for your account
				</p>
			</div>
			<div className="grid gap-6">
				{/* Password Field */}
				<div className="grid gap-2 relative">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						type={showPassword ? "text" : "password"}
						required
						className="pr-10"
					/>
					<button
						type="button"
						onClick={() => setShowPassword((prev) => !prev)}
						className="absolute right-3 top-[30px] text-muted-foreground"
					>
						{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
					</button>
				</div>

				{/* Confirm Password Field */}
				<div className="grid gap-2 relative">
					<Label htmlFor="confirmPassword">Confirm Password</Label>
					<Input
						id="confirmPassword"
						type={showConfirmPassword ? "text" : "password"}
						required
						className="pr-10"
					/>
					<button
						type="button"
						onClick={() => setShowConfirmPassword((prev) => !prev)}
						className="absolute right-3 top-[30px] text-muted-foreground"
					>
						{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
					</button>
				</div>

				<Button type="submit" className="w-full">
					Confirm
					<Link href={"/verify-otp-success"}></Link>
				</Button>
			</div>
		</form>
	);
}
