import * as z from 'zod';

export const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email message' }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long',
  }),
  name: z.string().min(2, { message: 'Please add a name with at least 2 characters' }),
});
