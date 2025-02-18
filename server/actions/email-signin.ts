'use server'
import { eq } from "drizzle-orm";
import { actionClient } from "./action-client";
import { loginSchema } from "@/types/login-schema"
import { db } from "..";
import { users } from "../schema";

export const emailSignIn = actionClient.schema(loginSchema).stateAction(async ({ parsedInput: { email, password, code }}) => {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email)
  })

  if (existingUser?.email !== email) {
    return {error: "Email not found"}
  }

  console.log(email, password, code);
  return { success: email };
});