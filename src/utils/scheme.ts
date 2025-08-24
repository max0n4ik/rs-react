import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[A-ZА-Я]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-zа-я]/, 'Password must contain at least one lowercase letter')
  .regex(/[^A-Za-zА-Яа-я0-9]/, 'Password must contain at least one special character');

export const userSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name is required')
      .regex(/^[A-Z]/, 'First letter must be uppercase'),

    age: z.coerce
      .number<string>()
      .int('Age must be a whole number')
      .nonnegative('Age cannot be negative')
      .min(16, 'The age must be over 16'),

    email: z.email('Invalid email address'),

    gender: z.enum(['male', 'female', 'other'], {
      error: 'Enter your gender',
    }),

    acceptedTC: z.literal(true, { error: 'Please accept T&C to continue' }),

    country: z.string().min(1, 'Country required'),
    image: z
      .preprocess(
        (val) => {
          if (val instanceof FileList && val.length > 0) {
            return val[0];
          }
          return val;
        },
        z.instanceof(File, { message: 'Expected an image file.' })
      )
      .refine(
        (file) => ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
        'Only .jpg, .jpeg, .png formats are supported.'
      ),
    password: passwordSchema,
    passwordConfirm: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  });

export type UserFormData = z.infer<typeof userSchema>;
