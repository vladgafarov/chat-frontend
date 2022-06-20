import { z } from "zod"

export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, "At least 6 characters"),
})

export type LoginType = z.infer<typeof LoginSchema>
