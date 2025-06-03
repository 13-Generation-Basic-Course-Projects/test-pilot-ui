// src/auth.j
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInService } from "./service/signInService";


export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },

      authorize: async (credentials) => {
        try {
        //   const user = await signInService(credentials);

        //   if (!user) {
        //     throw new Error("Invalid credentials");
        //   }
          // console.log("user", user);
          
          return null;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],

  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },

  callbacks: {
    jwt: async ({ token, user }) => {

      if (user) {
        token.user = user;
      }

      return token; // Ensure token is always returned
    },
    session: async ({ session, token }) => {

    //   if (token && token.user) {
    //     session.user = token.user;
    //   }
      // console.log("Token: ", token);
      // console.log("Seesion token: ", session);
      
      
      return session;
    },
  },
});