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
import {
	verifyOTPAction,
	resendOTPAction,
	resendOTPResetPasswordAction,
} from "@/action/auth-action";
import { useRegister } from "@/store/email-register-slice";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { VERIFICATION_TYPE } from "@/lib/verification-type";
import { verifyOTPResetPasswordService } from "@/service/auth-service";

const FormSchema = z.object({
	pin: z.string().regex(/^\d{6}$/, {
		message: "Your one-time password must be exactly 6 digits.",
	}),
});

export function VerifyOtpConfirmForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"form">) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			pin: "",
		},
	});

	const verificationType = searchParams.get("VERIFICATION_TYPE");
	const resetPasswordEmail = searchParams.get("email");
	const { registeredEmail } = useRegister();
	const [isResending, setIsResending] = useState(false);
	const [resendCooldown, setResendCooldown] = useState(0);

	// Validate email presence
	useEffect(() => {
		if (!registeredEmail && verificationType === VERIFICATION_TYPE.register) {
			toast.error("No email found for verification. Please register again.");
			router.replace("/register");
		}
	}, [registeredEmail, router, verificationType]);

	// Handle OTP submission
	const onSubmit = useCallback(
		async (data: z.infer<typeof FormSchema>) => {
			try {
				const email =
					verificationType === VERIFICATION_TYPE.register
						? registeredEmail
						: resetPasswordEmail;

				if (!email) {
					toast.error("Email is missing. Cannot verify OTP.");
					router.replace(
						verificationType === VERIFICATION_TYPE.register
							? "/register"
							: "/forgot-password"
					);
					return;
				}

				let verifyData = null;
				if (verificationType === VERIFICATION_TYPE.register) {
					verifyData = await verifyOTPAction({
						otp: data.pin,
						email: email,
					});
				} else {
					verifyData = await verifyOTPResetPasswordService({
						otp: data.pin,
						email: email,
					});
				}
				console.log("Vefiication data " + verifyData);
				if (verifyData?.success || verifyData) {
					toast.success(verifyData.message || "Verification successful!");

					switch (verificationType) {
						case VERIFICATION_TYPE.register:
							router.push("/login");
							break;
						case VERIFICATION_TYPE.resetPassword:
							router.push(`/verify-otp-update?email=${resetPasswordEmail}`);
							break;
					}
				} else {
					throw new Error(verifyData?.message || "OTP verification failed");
				}
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : "An error occurred"
				);
			}
		},
		[registeredEmail, resetPasswordEmail, router, verificationType]
	);

	// Handle OTP resend
	const handleResendOTP = useCallback(
		async (e: React.MouseEvent) => {
			e.preventDefault();
			if (isResending || resendCooldown > 0) return;

			const email =
				verificationType === VERIFICATION_TYPE.register
					? registeredEmail
					: resetPasswordEmail;

			if (!email) {
				toast.error("No email found to resend OTP.");
				router.replace(
					verificationType === VERIFICATION_TYPE.register
						? "/register"
						: "/forgot-password"
				);
				return;
			}

			setIsResending(true);
			try {
				switch (verificationType) {
					case VERIFICATION_TYPE.register:
						await resendOTPAction({ email });
						break;
					case VERIFICATION_TYPE.resetPassword:
						await resendOTPResetPasswordAction({
							email: resetPasswordEmail as string,
						});
						break;
				}
				const result = await resendOTPAction({ email });
				if (result?.success) {
					toast.success(result.message || "New OTP sent!");
					setResendCooldown(60);
				} else {
					throw new Error(result?.message || "Failed to resend OTP");
				}
			} catch (error) {
				toast.error(error instanceof Error ? error.message : "Resend failed");
			} finally {
				setIsResending(false);
			}
		},
		[
			isResending,
			resendCooldown,
			registeredEmail,
			resetPasswordEmail,
			router,
			verificationType,
		]
	);

	// Resend cooldown timer
	useEffect(() => {
		if (resendCooldown <= 0) return;
		const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
		return () => clearTimeout(timer);
	}, [resendCooldown]);

	// Prevent non-numeric input
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (
			!/^\d$/.test(e.key) &&
			e.key !== "Backspace" &&
			e.key !== "Delete" &&
			e.key !== "Tab"
		) {
			e.preventDefault();
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn("flex flex-col gap-8 mb-10", className)}
				{...props}
			>
				{/* Header with clickable email */}
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="text-2xl font-bold text-[#34302B]">
						{verificationType === VERIFICATION_TYPE.register
							? "Verify Your Account"
							: "Verify OTP"}
					</h1>
					<p className="text-balance text-sm text-[#94A3B8]">
						{verificationType === VERIFICATION_TYPE.register
							? "A 6-digit verification code has been sent to"
							: "Enter the 6-digit OTP sent to"}{" "}
						<button
							type="button"
							className="font-semibold text-gray-800 hover:text-blue-600 transition-colors underline"
							onClick={() => {
								const email =
									verificationType === VERIFICATION_TYPE.register
										? registeredEmail
										: resetPasswordEmail;
								if (email) {
									navigator.clipboard.writeText(email);
									toast.success("Email copied to clipboard!");
								}
							}}
						>
							{verificationType === VERIFICATION_TYPE.register
								? registeredEmail
								: resetPasswordEmail || "your email"}
						</button>
					</p>
				</div>

				{/* OTP Input Field with visual feedback */}
				<div className="flex flex-col gap-2">
					<FormField
						control={form.control}
						name="pin"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div className="flex flex-col items-center gap-4">
										<InputOTP
											maxLength={6}
											{...field}
											onKeyDown={handleKeyDown}
											inputMode="numeric"
											pattern="\d*"
											className="group focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 rounded-lg transition-all"
										>
											<InputOTPGroup className="flex gap-3 sm:gap-5">
												{[...Array(6)].map((_, index) => (
													<InputOTPSlot
														key={index}
														index={index}
														className={cn(
															"w-14 h-14 sm:w-[66px] sm:h-[66px] text-center",
															"bg-[#F4F6FA] rounded-md border border-gray-300",
															"transition-all duration-200",
															"focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
															"hover:border-gray-400",
															field.value.length === index
																? "ring-2 ring-blue-300"
																: ""
														)}
													/>
												))}
											</InputOTPGroup>
										</InputOTP>
										<p className="text-sm text-gray-500">
											Didn't receive code?{" "}
											<button
												type="button"
												className={cn(
													"font-medium text-blue-600 hover:text-blue-800",
													"underline transition-colors",
													{
														"text-gray-400 cursor-not-allowed":
															isResending || resendCooldown > 0,
													}
												)}
												onClick={handleResendOTP}
												disabled={isResending || resendCooldown > 0}
											>
												{isResending
													? "Sending..."
													: resendCooldown > 0
													? `Resend in ${resendCooldown}s`
													: "Click to resend"}
											</button>
										</p>
									</div>
								</FormControl>
								<FormMessage className="text-center" />
							</FormItem>
						)}
					/>
				</div>

				{/* Submit Button with loading animation */}
				<Button
					type="submit"
					className="w-full py-6 rounded-lg transition-all hover:shadow-md"
					disabled={form.formState.isSubmitting}
				>
					{form.formState.isSubmitting ? (
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
							Verifying...
						</div>
					) : (
						"Verify Account"
					)}
				</Button>

				{/* Back to login/signup option */}
				<div className="text-center text-sm text-gray-500 mt-4">
					{verificationType === VERIFICATION_TYPE.register ? (
						<p>
							Already have an account?{" "}
							<Link
								href="/login"
								className="text-blue-600 hover:text-blue-800 underline transition-colors"
							>
								Sign in
							</Link>
						</p>
					) : (
						<p>
							Remember your password?{" "}
							<Link
								href="/login"
								className="text-blue-600 hover:text-blue-800 underline transition-colors"
							>
								Login here
							</Link>
						</p>
					)}
				</div>
			</form>
		</Form>
	);
}
