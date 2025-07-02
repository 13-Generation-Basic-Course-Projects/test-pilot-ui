"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { requestResetPasswordService } from "@/service/auth-service";
import { toast } from "sonner";
import { VERIFICATION_TYPE } from "@/lib/verification-type";
import { useRouter } from "next/navigation";

type FormData = {
	email: string;
};

export function ForgotPasswordForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"form">) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();
	const router = useRouter();

	const onSubmit = async (data: FormData) => {
		setIsSubmitting(true);
		try {
			await requestResetPasswordService({ email: data.email });
			toast.success("Password reset instructions sent to your email!");
			router.push(
				`/verify-otp-confirm?VERIFICATION_TYPE=${VERIFICATION_TYPE.resetPassword}&email=${data.email}`
			);
		} catch (error) {
			toast.error(
				(error as Error).message || "Error sending password reset request"
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className={cn("flex flex-col gap-8 mb-10", className)}
			{...props}
		>
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
						className="text-[#94A3B8]"
						disabled={isSubmitting}
						{...register("email", {
							required: "Email is required",
							pattern: {
								value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
								message: "Invalid email address",
							},
						})}
					/>
					{errors.email && (
						<p className="text-red-500 text-sm">{errors.email.message}</p>
					)}
				</div>

				{/* Submit Button */}
				<Button type="submit" className="w-full" disabled={isSubmitting}>
					{isSubmitting ? "Sending..." : "Send"}
				</Button>
			</div>

			<div className="text-center text-sm text-[#94A3B8]">
				Remember your password?{" "}
				<Link href="/login" className="text-[#0973DC] hover:underline">
					Login
				</Link>
			</div>
		</form>
	);
}
