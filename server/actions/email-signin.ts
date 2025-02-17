'use server'
import { loginSchema } from "@/types/login-schema"
import { createSafeActionClient } from "next-safe-action"

export const actionClient = createSafeActionClient();

export const emailSignIn = actionClient.schema(loginSchema).stateAction(async ({ parsedInput: { email, password, code }}) => {
  console.log(email, password, code);
  return { email };
});