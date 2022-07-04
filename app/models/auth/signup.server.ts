import { z } from "zod"

export const SignupSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, "At least 6 characters"),
	repeatPassword: z.string().min(6, "At least 6 characters"),
})

export type SignupType = z.infer<typeof SignupSchema>

export const signup = async (data: Omit<SignupType, "repeatPassword">) => {
	const { email, password } = data

	const user = await fetch(`${process.env.BACKEND_URL}/signup`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email, password, name: "Test" }),
	})

	return await user.json()
}
