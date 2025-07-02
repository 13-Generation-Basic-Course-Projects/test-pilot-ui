import NextAuth, { AuthError, CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "@auth/core/providers/google";
import GitHub from "@auth/core/providers/github";
import {
	githubLoginService,
	googleLoinService,
	signInService,
} from "./service/auth-service";

class CustomError extends CredentialsSignin {
	constructor(code: string) {
		super();
		this.code = code;
		this.message = code;
		this.stack = undefined;
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			credentials: {
				email: {},
				password: {},
				githubCode: {},
			},
			// The authorize function for email/password is correct.
			// It returns an object with a `.token` property.
			authorize: async (credentials) => {
				try {
					const { githubCode } = credentials;
					let userToken: { token: string } = { token: "" };
					console.log("codeeeee");
					if (githubCode) {
						userToken = await githubLoginService({
							githubCode: githubCode as string,
						});
						console.log("tokennenenenenen " + userToken);
						return {
							id: "some-id",
							token: userToken.token,
						};
					}

					userToken = await signInService({
						credentials,
					} as any);
					if (!userToken || !userToken.token) {
						throw new CustomError("Invalid Credential");
					}
					return {
						id: "some-id", // Or a real ID if you have one
						token: userToken.token,
					};
				} catch (error: any) {
					throw new CustomError(error.message || "Sign-in failed");
				}
			},
		}),
		Google({
			clientId: process.env.AUTH_GOOGLE_ID,
			clientSecret: process.env.AUTH_GOOGLE_SECRET,
		}),
	],
	secret: process.env.AUTH_SECRET,
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/login",
	},
	debug: process.env.NODE_ENV === "development",

	callbacks: {
		async jwt({ token, user, account }) {
			if (account && user) {
				if (account.provider === "google") {
					try {
						const googleIdToken = account.id_token as string;

						const backendPayload = await googleLoinService({
							accessToken: googleIdToken,
						});

						token.accessToken = backendPayload.token;

						token.name = user.name;
						token.email = user.email;
						token.picture = user.image;
					} catch (error) {
						console.error("Error during Google token exchange:", error);
						return null;
					}
				}
				if (account.provider === "github") {
					try {
						const githubIdToken = account.id_token as string;

						const backendPayload = await googleLoinService({
							accessToken: githubIdToken,
						});

						token.accessToken = backendPayload.token;

						token.name = user.name;
						token.email = user.email;
						token.picture = user.image;
					} catch (error) {
						console.error("Error during Google token exchange:", error);
						return null;
					}
				}

				// If the user signed in with email/password...
				if (account.provider === "credentials") {
					// The `user` object comes from your `authorize` function.
					// It already has the `.token` property.
					token.accessToken = (user as { token: string }).token;
				}
			}

			// On subsequent requests, return the token we have built.
			return token;
		},

		async session({ session, token }) {
			// The `token` object is what we built in the `jwt` callback.
			// Now, we pass the `accessToken` to the client-side session.
			if (token) {
				session.accessToken = token.accessToken as string;
				// Also pass other user details to the client session if needed
				if (session.user) {
					session.user.name = token.name;
					if (token.email) {
						session.user.email = token.email;
					}
				}
			}
			return session;
		},
	},
});
