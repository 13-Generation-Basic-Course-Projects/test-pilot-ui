import NextAuth, { AuthError, CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "@auth/core/providers/google";
import GitHub from "@auth/core/providers/github";
import { googleLoinService, signInService } from "./service/auth-service";

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
			},
			// The authorize function for email/password is correct.
			// It returns an object with a `.token` property.
			authorize: async (credentials) => {
				try {
					const userToken: { token: string } = await signInService({
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
		GitHub({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
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

	// ===================================================================
	// THE FINAL CORRECTED CALLBACKS
	// ===================================================================
	callbacks: {
		// We no longer need the signIn callback for this logic.
		// async signIn({ account, user }) { ... }

		async jwt({ token, user, account }) {
			// `account` and `user` are only passed on the very first sign-in.
			if (account && user) {
				// If the user signed in with Google...
				if (account.provider === "google") {
					try {
						// 1. Get the Google ID token.
						const googleIdToken = account.id_token as string;

						// 2. Call your backend to get your custom token.
						const backendPayload = await googleLoinService({
							accessToken: googleIdToken,
						});

						// 3. THIS IS THE KEY STEP: Save your custom token to the session.
						// From your log, the token is in `backendPayload.token`.
						token.accessToken = backendPayload.token;

						// 4. (Optional but recommended) Persist user info from Google.
						token.name = user.name;
						token.email = user.email;
						token.picture = user.image;
					} catch (error) {
						console.error("Error during Google token exchange:", error);
						return null; // Prevent login if the backend call fails
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
