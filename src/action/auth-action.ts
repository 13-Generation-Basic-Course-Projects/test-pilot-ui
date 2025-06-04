"use server";
import { signIn, signOut } from "@/auth";
import {
	requestOTPPasswordService,
	resendOTPService,
	signUpService,
	verifyOTPService,
} from "@/service/auth-service";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export const signInAction = async (formData: FormData) => {
	try {
		await signIn("credentials", {
			email: formData.get("email"),
			password: formData.get("password"),
			redirectTo: "/project",
		});
	} catch (error) {
		if (error instanceof AuthError) {
			return redirect(`/login?error=${error.message}`);
		}
		throw error;
	}
};

export async function signUpAction(
	prevState: { message: string | null; success: boolean },
	formData: FormData
) {
	try {
		const credentialData = {
			name: formData.get("name") as string,
			email: formData.get("email") as string,
			password: formData.get("password") as string,
		};

		const result = await signUpService({ credentials: credentialData });
		return {
			message: result.message,
			success: result.success,
		};
	} catch (error) {
		let errorMessage = "An unexpected error occurred.";
		if (error instanceof Error) {
			errorMessage = error.message;
		}
		console.error("Sign-up action error:", error);
		return {
			message: errorMessage,
			success: false,
		};
	}
}

export const verifyOTPAction = async ({
	otp,
	email,
}: {
	otp: string;
	email: string;
}) => {
	try {
		const credentialData = { otp, email };
		const data = await verifyOTPService({ credentials: credentialData });
		console.log("otp", data);
		return data;
	} catch (error) {}
};

export const resendOTPAction = async ({ email }: { email: string }) => {
	try {
		const data = await resendOTPService({ email });
		console.log("email", data);
		return data;
	} catch (error) {}
};

export const forgetPasswordAction = async (
	prevState: { message: string | null; success: boolean },
	formData: FormData
) => {
	const data = await requestOTPPasswordService({
		email: formData.get("email") as string,
	});

	console.log(data);
	return data;
};

export const logout = async () => {
	await signOut();
	redirect("/");
};
