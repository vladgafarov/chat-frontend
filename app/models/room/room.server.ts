import type { Room } from "~/types/Room"
import { getAccessTokenCookie } from "../auth/session.server"

export const createRoom = async (
	users: number[],
	isGroupChat: boolean,
	request: Request,
): Promise<Room> => {
	try {
		const res = await fetch(`${process.env.BACKEND_URL}/rooms`, {
			method: "POST",
			credentials: "include",
			headers: {
				Cookie: await getAccessTokenCookie(request),
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ users, isGroupChat }),
		})

		if (res.status >= 400) {
			const error = await res.json()

			throw new Error(error.message)
		}
		const room = await res.json()

		return room
	} catch (error: any) {
		throw new Error(error.message)
	}
}

export const getRooms = async (request: Request): Promise<Room[]> => {
	try {
		const res = await fetch(`${process.env.BACKEND_URL}/rooms`, {
			method: "GET",
			credentials: "include",
			headers: {
				Cookie: await getAccessTokenCookie(request),
			},
		})

		const rooms = await res.json()

		return rooms
	} catch (error: any) {
		throw new Error(error.message)
	}
}

export const getRoom = async (id: string, request: Request): Promise<Room> => {
	try {
		const res = await fetch(`${process.env.BACKEND_URL}/rooms/${id}`, {
			method: "GET",
			credentials: "include",
			headers: {
				Cookie: await getAccessTokenCookie(request),
			},
		})

		if (res.status === 404) {
			throw new Error("404")
		}

		const room = await res.json()

		return room
	} catch (error: any) {
		throw new Error(error.message)
	}
}
