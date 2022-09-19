import type { User } from "~/models/user/user.server"
import type { Message } from "./Message"

export interface Room {
	id: number
	title: string
	messages: Message[]
	authorId: number
	createdAt: string
	invitedUsers: User[]
	isGroupChat: boolean
	author: {
		email: string
		name: string
		online: boolean
	}
}
