'use server'
import { eq } from "drizzle-orm";
import { actionClient } from "./action-client";
import { loginSchema } from "@/types/login-schema"
import { db } from "..";
import { users } from "../schema";
import { generateEmailVerificationToken } from "./tokens";
import { sendVerificationEmail } from "./email";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

export const emailSignIn = actionClient.schema(loginSchema).stateAction(async ({ parsedInput: { email, password, code }}) => {
  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email)
    })

    if (existingUser?.email !== email) {
      return {error: "Email not found"}
    }

    if (!existingUser.emailVerified) {
      const verificationToken = await generateEmailVerificationToken(email);
      await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token);
      return { success: "Confirmation Email Sent!" };
    }

    await signIn('credentials', {
      email,
      password,
      redirectTo: '/',
    })

    return { success: "User Signed In!" };
  } catch (error) {
    if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Email or Password Incorrect" }
          case "AccessDenied":
            return { error: error.message }
          case "OAuthSignInError":
            return { error: error.message }
          default:
            return { error: "Something went wrong" }
        }
      }
      throw error
  }
});