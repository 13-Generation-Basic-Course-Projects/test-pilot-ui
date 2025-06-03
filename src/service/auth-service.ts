import { AUTH_ENDPOINT } from "@/lib/static";
import { LoginResponseType } from "@/types";

export const signInService = async ({
	credentials,
}: {
	credentials: { email: string; password: string };
}) => {
	try {
		const credentialData = {
			email: credentials.email,
			password: credentials.password,
		};
		const res = await fetch(`${AUTH_ENDPOINT}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(credentialData),
		});

		const data: LoginResponseType = await res.json();

		return data.data;
	} catch (error) {
		throw new Error("can't fetch user");
	}
};
