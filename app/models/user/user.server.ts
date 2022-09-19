import { getAccessTokenCookie } from "../auth/session.server"

export interface User {
	id: number
	email: string
	createdAt: string
	name: string
	online: boolean
	avatarUrl: string | null
}

export const getUser = async (request: Request): Promise<User> => {
	try {
		const response = await fetch(`${process.env.BACKEND_URL}/profile`, {
			method: "GET",
			credentials: "include",
			headers: {
				Cookie: await getAccessTokenCookie(request),
			},
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

export const searchUser = async (email: string): Promise<User[]> => {
	try {
		const response = await fetch(
			`${process.env.BACKEND_URL}/user?email=${email}`,
			{
				method: "GET",
			},
		)
		const resData = await response.json()

		if (response.status !== 200) {
			throw new Error(resData.message)
		}

		return resData
	} catch (error: any) {
		throw new Error(error.message)
	}
}
