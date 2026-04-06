import { z } from 'zod'

export const usernameValidation = z
    .string()
    .min(2, { message: "Username must be at least 2 characters" })
    .max(20, { message: "Username must be no more than 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username must not contain special characters" });


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().trim().email({ message: "Invalid email" }),
    password: z.string().min(4, { message: "Password is too short" }).max(8, { message: "Password is too long" }),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;