import type { User } from "~/models/user/user.server"
import type { Message } from "./Message"

export interface Room {
	id: number
	title: string
	messages: Message[]
	authorId: number | null
	createdAt: string
	invitedUsers: User[]
	isGroupChat: boolean
	countUnreadMessages: number
	isCurrentUserAuthor: boolean
	image?: string
	author: {
		id: number
		email: string
		name: string
		online: boolean
		avatarThumbnailUrl: string
	} | null
}
