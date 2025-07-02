"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { resetPasswordService } from "@/service/auth-service";

export function VerifyOtpUpdatePasswordForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"form">) {
	const searchParams = useSearchParams();
	const email = searchParams.get("email") || "";
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm({
		defaultValues: {
			email,
			newPassword: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: any) => {
		if (data.newPassword !== data.confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		setIsSubmitting(true);
		try {
			const response = await resetPasswordService({
				email: data.email,
				newPassword: data.newPassword,
				confirmPassword: data.confirmPassword,
			});

			if (response.success) {
				toast.success("Password reset successfully!");
				window.location.href = "/verify-otp-success";
			} else {
				toast.error(response.message || "Failed to reset password");
			}
		} catch (error: any) {
			toast.error(error.message || "An error occurred. Please try again.");
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
						{...register("newPassword", {
							required: "Password is required",
							minLength: {
								value: 8,
								message: "Password must be at least 8 characters",
							},
						})}
					/>
					<button
						type="button"
						onClick={() => setShowPassword((prev) => !prev)}
						className="absolute right-3 top-[30px] text-muted-foreground"
					>
						{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
					</button>
					{errors.newPassword && (
						<p className="text-sm text-red-500">{errors.newPassword.message}</p>
					)}
				</div>

				{/* Confirm Password Field */}
				<div className="grid gap-2 relative">
					<Label htmlFor="confirmPassword">Confirm Password</Label>
					<Input
						id="confirmPassword"
						type={showConfirmPassword ? "text" : "password"}
						required
						className="pr-10"
						{...register("confirmPassword", {
							required: "Please confirm your password",
							validate: (value) =>
								value === watch("newPassword") || "Passwords do not match",
						})}
					/>
					<button
						type="button"
						onClick={() => setShowConfirmPassword((prev) => !prev)}
						className="absolute right-3 top-[30px] text-muted-foreground"
					>
						{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
					</button>
					{errors.confirmPassword && (
						<p className="text-sm text-red-500">
							{errors.confirmPassword.message}
						</p>
					)}
				</div>

				<Button type="submit" className="w-full" disabled={isSubmitting}>
					{isSubmitting ? "Processing..." : "Confirm"}
				</Button>
			</div>

			{/* Added navigation back to login */}
			<div className="text-center text-sm text-muted-foreground">
				Remember your password?{" "}
				<Link href="/login" className="text-primary hover:underline">
					Login here
				</Link>
			</div>
		</form>
	);
}
