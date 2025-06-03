"use server";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export const signInAction = async (formData: FormData) => {
	try {
		console.log(formData.get("email"));
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

export async function logout() {
	await signOut();
	redirect("/"); // Redirect to homepage after logout
}
