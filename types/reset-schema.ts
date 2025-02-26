import * as z from 'zod';

export const resetSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
});

export type zResetSchema = z.infer<typeof resetSchema>;
