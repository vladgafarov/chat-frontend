import { z } from "zod"

export const SignupSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, "At least 6 characters"),
	repeatPassword: z.string().min(6, "At least 6 characters"),
})

export type SignupType = z.infer<typeof SignupSchema>
