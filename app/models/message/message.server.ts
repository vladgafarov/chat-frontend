import type { Message } from "~/types/Message"
import { getAccessTokenCookie } from "../auth/session.server"

export const addMessage = async (
	formData: FormData,
	request: Request,
): Promise<Message> => {
	console.log([...formData.entries()])
	try {
		const res = await fetch(`${process.env.BACKEND_URL}/message`, {
			method: "POST",
			credentials: "include",
			headers: {
				Cookie: await getAccessTokenCookie(request),
			},
			body: formData,
		})

		if (res.status >= 400) {
			const error = await res.json()

			throw new Error(
				Array.isArray(error.message)
					? error.message.join(", ")
					: error.message,
			)
		}
		const room = await res.json()

		return room
	} catch (error: any) {
		throw new Error(error.message)
	}
}
