import { getAccessTokenCookie } from "../auth/session.server"

export interface IRoom {
	id: number
}

export const createRoom = async (
	users: number[],
	request: Request,
): Promise<IRoom> => {
	try {
		const res = await fetch(`${process.env.BACKEND_URL}/rooms`, {
			method: "POST",
			credentials: "include",
			headers: {
				Cookie: await getAccessTokenCookie(request),
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ users }),
		})

		const room = await res.json()

		return room
	} catch (error: any) {
		throw new Error(error.message)
	}
}
