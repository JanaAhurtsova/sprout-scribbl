import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email message' }),
  password: z.string().min(4, { message: 'Password is required' }),
  code: z.optional(z.string()),
});

export type zLoginSchema = z.infer<typeof loginSchema>;
