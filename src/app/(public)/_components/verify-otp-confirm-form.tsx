"use client";

import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

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

// Define form schema with zod
const FormSchema = z.object({
	email: z.string().email({ message: "Invalid email address." }),
	pin: z.string().length(6, {
		message: "Your one-time password must be exactly 6 characters.",
	}),
});

export function VerifyOtpConfirmForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"form">) {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: "",
			pin: "",
		},
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		console.log("OTP Verify Data:", data);
		// TODO: handle OTP verification (e.g., call API)
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn("flex flex-col gap-8 mb-10", className)}
				{...props}
			>
				{/* Header */}
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="text-2xl font-bold">Verify your Account</h1>
					<p className="text-balance text-sm text-muted-foreground">
						OTP already sent to your email address. Enter to verify.
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
				<Button type="submit" className="w-full">
					Verify
				</Button>

				{/* Resend OTP */}
				<div className="text-center text-sm">
					<div className="flex justify-between">
						<div />
						<div className="-mt-7 text-[#94A3B8]">
							<a href="#" className="underline">
								Resend OTP
							</a>
						</div>
					</div>
				</div>
			</form>
		</Form>
	);
}
