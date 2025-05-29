"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link"; // ✅ Correct import for routing

export function ForgotPasswordForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"form">) {
	return (
		<form className={cn("flex flex-col gap-8 mb-10", className)} {...props}>
			{/* Header */}
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Forgot Password</h1>
				<p className="text-balance text-sm text-[#94A3B8]">
					Enter your email to reset your account
				</p>
			</div>

			{/* Email Input */}
			<div className="grid gap-6">
				<div className="grid gap-2">
					<Label htmlFor="email" className="text-[#020617]">
						Email Address
					</Label>
					<Input
						id="email"
						type="email"
						placeholder="channarith@gmail.com"
						required
						className="text-[#94A3B8]"
					/>
				</div>

				{/* Submit Button */}
				<Button type="submit" className="w-full">
					Send
				</Button>
			</div>

			{/* Back to Login */}
			<div className="text-center text-sm text-[#94A3B8]">
				Remember your password?{" "}
				<Link href="/login" className="text-[#0973DC] hover:underline">
					Login
				</Link>
			</div>
		</form>
	);
}
