import { z } from "zod"

export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, "At least 6 characters"),
})

export type LoginType = z.infer<typeof LoginSchema>

export const login = async (data: LoginType) => {
	const user = await fetch(`${process.env.BACKEND_URL}/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
		credentials: "include",
	})

	console.log(await user.json())

	return await user.json()
}
