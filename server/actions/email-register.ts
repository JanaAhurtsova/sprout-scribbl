'use client'
import { registerSchema } from "@/types/register-schema";
import { actionClient } from "./action-client";
import bcrypt from 'bcryptjs';
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { db } from "..";
import { generateEmailVerificationToken } from "./tokens";
import { sendVerificationEmail } from "./email";

const saltRounds = 10;

export const emailRegister = actionClient.schema(registerSchema).stateAction(async ({ parsedInput: { name, email, password }}) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    })
  if (existingUser) {
    if (!existingUser.emailVerified) {
      const verificationToken = await generateEmailVerificationToken(email);
      await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
      return { success: "Email Confirmation resent" };
    }

    return {error: "Email already in use"}
  }
  await db.insert(users).values({email, name, password: hashedPassword });
  const verificationToken = await generateEmailVerificationToken(email);

  await sendVerificationEmail(
    verificationToken[0].email,
    verificationToken[0].token
  );

  return { success: "Confirmation Email Sent!" };
})