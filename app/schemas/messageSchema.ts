import { z } from 'zod'

export const messageSchema = z.object({
    context: z.string().min(10, { message: "content must be of 10 characters" }).max(300, { message: "content must be nolonger than 300 characters" })
});

export type MessageSchema = z.infer<typeof messageSchema>;