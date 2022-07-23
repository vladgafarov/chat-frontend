import { z } from "zod"

export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, "At least 6 characters"),
})

export type LoginType = z.infer<typeof LoginSchema>

export const login = async (
	data: LoginType,
): Promise<{ access_token: string; refresh_token: string }> => {
	try {
		const response = await fetch(`${process.env.BACKEND_URL}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
			credentials: "include",
		})
		const resData = await response.json()

		if (response.status !== 200) {
			throw new Error(resData.message)
		}

		return resData
	} catch (error: any) {
		throw new Error(error.message)
	}
}
