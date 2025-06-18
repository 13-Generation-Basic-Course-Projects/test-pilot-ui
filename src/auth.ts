import NextAuth, { AuthError, CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { googleLoinService, signInService } from "./service/auth-service";
import Google from "@auth/core/providers/google";
import GitHub from "@auth/core/providers/github";

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
			authorize: async (credentials) => {
				try {
					// Implement Login with jwt and session
					const userToken: { token: string } = await signInService({
						credentials,
					} as {
						credentials: { email: string; password: string };
					});

					if (!userToken) {
						throw new CustomError("Invalid Credential");
					}

					return {
						id: "some-id",
						token: userToken.token,
					};
				} catch (error: any) {
					if (error instanceof AuthError) {
						throw new CustomError("invalid_schema");
					}
					throw new CustomError(error.message);
				}
			},
		}),
		Google({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
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
	callbacks: {
		async signIn({ account }) {
			if (account?.provider === "google") {
				const accessToken = account.id_token as string;
				await googleLoinService({ accessToken });
			}
			if (account?.provider === "github") {
				const accessToken = account.access_token;
				// Handle GitHub accessToken (send to backend, etc.)
			}
			return true;
		},
		async jwt({ token, user }) {
			if (user) {
				token.accessToken = (user as { id: string; token: string }).token;
			}

			return token;
		},
		async session({ session, token }) {
			if (token) {
				return { ...session, accessToken: token.accessToken };
			}
			return session;
		},
	},
});
