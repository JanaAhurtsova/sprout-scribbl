'use server';

import { resetSchema } from '@/types/reset-schema';
import { actionClient } from './action-client';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { users } from '../schema';
import { generatePasswordResetToken } from './tokens';
import { sendPasswordResetEmail } from './email';

export const resetPassword = actionClient
  .schema(resetSchema)
  .stateAction(async ({ parsedInput: { email } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!existingUser) {
      return { error: 'User not found' };
    }

    const passwordResetTokens = await generatePasswordResetToken(email);
    if (!passwordResetTokens) {
      return { error: 'Token not generated' };
    }
    await sendPasswordResetEmail(passwordResetTokens[0].email, passwordResetTokens[0].token);
    return { success: 'Reset Email Sent' };
  });
