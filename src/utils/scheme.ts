import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const userSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name is required')
      .regex(/^[A-Z]/, 'First letter must be uppercase'),

    age: z
      .number()
      .int('Age must be a whole number')
      .nonnegative('Age cannot be negative')
      .min(0, 'Age cannot be zero'),

    email: z.email('Invalid email address'),
    gender: z.literal(['male', 'female', 'other'], { error: 'Enter your gender' }),
    acceptedTC: z.literal(true, { error: 'Please accept T&C to continue' }),
    password: passwordSchema,

    passwordConfirm: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type UserFormData = z.infer<typeof userSchema>;
