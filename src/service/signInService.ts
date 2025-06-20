import { User } from "@/types";

export type CredentialsType = {
  email: string;
  password: string;
};

export const signInService = async (
  credentials: CredentialsType
): Promise<User> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/auths/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Invalid credentials");
    }

    const user: User = await response.json();
    return user;
  } catch (error) {
    console.error("SignIn error:", error);
    throw error;
  }
};
