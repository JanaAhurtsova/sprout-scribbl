'use server';

import { settingsSchema } from '@/types/settings-schema';
import { actionClient } from './action-client';
import { auth } from '../auth';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { users } from '../schema';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { saltRounds } from './constants';

export const settings = actionClient.schema(settingsSchema).stateAction(async ({ parsedInput }) => {
  const user = await auth();
  if (!user) return { error: 'User not found' };

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.user.id),
  });
  if (!dbUser) return { error: 'User not found' };

  if (user.user.isOAuth) {
    parsedInput.email = undefined;
    parsedInput.password = undefined;
    parsedInput.newPassword = undefined;
    parsedInput.isTwoFactorEnabled = undefined;
  }

  if (parsedInput.password && parsedInput.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(parsedInput.password, dbUser.password);
    if (!passwordMatch) return { error: "Password doesn't match" };

    const samePassword = await bcrypt.compare(parsedInput.newPassword, dbUser.password);
    if (samePassword) return { error: 'New password is the same as the old password' };

    const hashedPassword = await bcrypt.hash(parsedInput.newPassword, saltRounds);
    parsedInput.password = hashedPassword;
    parsedInput.newPassword = undefined;
  }

  await db
    .update(users)
    .set({
      password: parsedInput.password,
      name: parsedInput.name,
      image: parsedInput.image,
      email: parsedInput.email,
      twoFactorEnabled: Number(parsedInput.isTwoFactorEnabled),
    })
    .where(eq(users.id, dbUser.id));

  revalidatePath('/dashboard/settings');

  return { success: 'Settings updated' };
});
