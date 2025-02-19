"use server"

import { newPasswordSchema } from "@/types/new-password-schema"
import { actionClient } from "./action-client"
import { getPasswordResetTokenByToken } from "./tokens";
import { eq } from "drizzle-orm";
import { passwordResetTokens, users } from "../schema";
import { db } from "..";
import bcrypt from "bcryptjs";

const saltRounds = 10;

export const newPassword = actionClient.schema(newPasswordSchema).stateAction(async ({ parsedInput: { password, token }}) => {
  if (!token) {
    return { error: "Missing Token" };
  }

  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: "Token not found"}
  }
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!"};
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, existingToken.email),
  });

  if (!existingUser) {
    return { error: "User not found" };
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await db.transaction(async (tx) => {
    await tx.update(users).set({
      password: hashedPassword,
    }).where(eq(users.id, existingUser.id));
    await tx.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id));
  })

  return { success: "Password updated" };
})