import { AUTH_ENDPOINT } from "@/lib/static";
import {
	BackendErrorResponse,
	LoginResponseType,
	RegisterResponseType,
} from "@/types";

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
		return data.payload;
	} catch (error) {
		throw new Error("can't fetch user");
	}
};

export const signUpService = async ({
	credentials,
}: {
	credentials: { name: string; email: string; password: string };
}) => {
	const credentialData = credentials;
	const res = await fetch(`${AUTH_ENDPOINT}/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(credentialData),
	});

	const data: RegisterResponseType | BackendErrorResponse = await res.json();

	if (!res.ok) {
		if (res.status === 409 && "detail" in data) {
			throw new Error(data.detail);
		} else if ("message" in data) {
			throw new Error(data.message);
		} else {
			if (typeof data.errors === "object" && data.errors !== null) {
				throw new Error(`${data.errors.password}`);
			}
			throw new Error(`${data.errors}`);
		}
	}

	return {
		message: (data as RegisterResponseType).message,
		success: (data as RegisterResponseType).success,
	};
};

export const verifyOTPService = async ({
	credentials,
}: {
	credentials: { otp: string; email: string };
}) => {
	const credentialData = credentials;
	const res = await fetch(`${AUTH_ENDPOINT}/verification/verify`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(credentialData),
	});

	const data = await res.json();
	return data;
};

export const resendOTPService = async ({ email }: { email: string }) => {
	const res = await fetch(`${AUTH_ENDPOINT}/verification/resend`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email }),
	});

	const data = await res.json();
	return data;
};

export const requestOTPPasswordService = async ({
	email,
}: {
	email: string;
}) => {
	const res = await fetch(`${AUTH_ENDPOINT}/password/request-reset-otp`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email }),
	});

	const data = await res.json();
	return data;
};

export const googleLoinService = async ({
	accessToken,
}: {
	accessToken: string;
}) => {
	console.log(accessToken);
	const res = await fetch(`${AUTH_ENDPOINT}/google-login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ accessToken }),
	});

	const data = await res.json();
	console.log(data);
	return data;
};
