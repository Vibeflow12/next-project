import { z } from 'zod'

export const verifySchema = z.object({
    code: z.string().trim().regex(/^\d{6}$/, { message: 'verification code must be exactly 6 digits' })
});

export type VerifySchema = z.infer<typeof verifySchema>;