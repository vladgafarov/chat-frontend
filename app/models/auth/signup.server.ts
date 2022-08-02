import { z } from "zod"

export const SignupSchema = z.object({
	email: z.string().email(),
	name: z.string(),
	password: z.string().min(6, "At least 6 characters"),
	repeatPassword: z.string().min(6, "At least 6 characters"),
})

export type SignupType = z.infer<typeof SignupSchema>

export const signup = async (data: Omit<SignupType, "repeatPassword">) => {
	const { email, password, name } = data

	try {
		const response = await fetch(`${process.env.BACKEND_URL}/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password, name }),
		})
		const resData = await response.json()

		if (response.status !== 201) {
			throw new Error(resData.message)
		}

		return resData
	} catch (error: any) {
		throw new Error(error.message)
	}
}
