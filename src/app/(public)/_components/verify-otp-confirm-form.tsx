"use client";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";

import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifyOTPAction, resendOTPAction } from "@/action/auth-action";
import { useRegister } from "@/store/email-register-slice";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const FormSchema = z.object({
	pin: z.string().length(6, {
		message: "Your one-time password must be exactly 6 characters.",
	}),
});

export function VerifyOtpConfirmForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"form">) {
	const router = useRouter();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			pin: "",
		},
	});

	const { registeredEmail } = useRegister();

	const [isResending, setIsResending] = useState(false);
	const [resendCooldown, setResendCooldown] = useState(0);

	useEffect(() => {
		if (!registeredEmail) {
			toast.error("No email found for verification. Please register again.");
			router.replace("/register");
		}
	}, [registeredEmail, router]);

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		if (!registeredEmail) {
			toast.error("Email is missing. Cannot verify OTP.");
			router.replace("/register");
			return;
		}

		console.log("OTP Verify Data:", data);
		console.log("OTP:", data.pin, "Email:", registeredEmail);

		const verifyData = await verifyOTPAction({
			otp: data.pin,
			email: registeredEmail as string,
		});

		if (verifyData && verifyData.success) {
			toast.success(verifyData.message || "Account verified successfully!");
			router.push("/login");
		} else {
			toast.error(
				verifyData?.message || "OTP verification failed. Please try again."
			);
		}
	}

	const handleResendOTP = async (e: React.MouseEvent) => {
		e.preventDefault();
		if (isResending || resendCooldown > 0) {
			return;
		}

		if (!registeredEmail) {
			toast.error("No registered email found to resend OTP.");
			router.replace("/register");
			return;
		}

		setIsResending(true);
		toast.info("Sending new OTP...");
		try {
			const result = await resendOTPAction({
				email: registeredEmail as string,
			});

			if (result && result.success) {
				toast.success(result.message || "New OTP sent successfully!");
				setResendCooldown(60);
			} else {
				toast.error(
					result?.message || "Failed to resend OTP. Please try again later."
				);
			}
		} catch (error) {
			console.error("Error resending OTP:", error);
			toast.error("An error occurred while resending OTP.");
		} finally {
			setIsResending(false);
		}
	};

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (resendCooldown > 0) {
			timer = setInterval(() => {
				setResendCooldown((prev) => prev - 1);
			}, 1000);
		}
		return () => clearInterval(timer);
	}, [resendCooldown]);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn("flex flex-col gap-8 mb-10", className)}
				{...props}
			>
				{/* Header */}
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="text-2xl font-bold text-[#34302B]">
						Verify your Account
					</h1>
					<p className="text-balance text-sm  text-[#94A3B8]">
						OTP already sent to{" "}
						<span className="font-semibold text-gray-800">
							{registeredEmail || "your email address"}
						</span>
						. Enter to verify.
					</p>
				</div>
				{/* OTP Input Field */}
				<FormField
					control={form.control}
					name="pin"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<InputOTP maxLength={6} {...field}>
									<InputOTPGroup className="flex gap-5">
										{[...Array(6)].map((_, index) => (
											<InputOTPSlot
												key={index}
												index={index}
												className="w-[66px] h-[66px] text-center bg-[#F4F6FA] rounded-md border border-gray-300"
											/>
										))}
									</InputOTPGroup>
								</InputOTP>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* Submit Button */}
				<Button
					type="submit"
					className="w-full"
					disabled={form.formState.isSubmitting}
				>
					{form.formState.isSubmitting ? "Verifying..." : "Verify"}
				</Button>
				{/* Resend OTP */}
				<div className="text-center text-sm">
					<div className="flex justify-between">
						<div />{" "}
						{/* This empty div seems to be for spacing, you can adjust your layout */}
						<div className="-mt-7 text-[#94A3B8]">
							<a
								href="#"
								className={cn("underline", {
									"opacity-50 cursor-not-allowed":
										isResending || resendCooldown > 0,
								})}
								onClick={handleResendOTP}
							>
								{isResending
									? "Sending..."
									: resendCooldown > 0
									? `Resend OTP in ${resendCooldown}s`
									: "Resend OTP"}
							</a>
						</div>
					</div>
				</div>
			</form>
		</Form>
	);
}
