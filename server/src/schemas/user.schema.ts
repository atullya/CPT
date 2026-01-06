import { z } from 'zod';
import { UserRole } from '../enums/role.enum';
import { create } from 'domain';

export const userValidationSchema = z.object({
  name: z
    .string()
    .nonempty('Name is required')
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name can’t be more than 50 characters long'),

  email: z
    .string()
    .email('Invalid email format')
    .transform((val) => val.toLowerCase().trim()),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(128, 'Password can’t exceed 128 characters')
    .optional(),

  role: z.enum([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER]).default(UserRole.USER),

  passwordResetToken: z.string().nullable().optional(),

  passwordResetExpires: z
    .preprocess((val) => (val ? new Date(val as string) : null), z.date().nullable())
    .optional(),
  createdBy: z.string().optional(),
});
// .refine(
//   (data) => {
//     if (data.role === UserRole.USER) {
//       return !!data.password && data.password.trim() !== '';
//     }
//     return true;
//   },
//   {
//     message: 'Password is required when creating a normal user',
//     path: ['password'],
//   },
// );

export const UserUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z
    .string()
    .email()
    .transform((val) => val.toLowerCase().trim())
    .optional(),
  password: z.string().min(6).max(128).optional(),
  role: z.enum([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER]).optional(),
});

export type UserInput = z.infer<typeof userValidationSchema>;
export type UserUpdateInput = z.infer<typeof UserUpdateSchema>;
