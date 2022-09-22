export interface Message {
	id: number
	text: string
	createdAt: string
	isRead: boolean
	authorId: number
	author: {
		id: number
		name: string
		email: string
		avatarUrl: string
		online: boolean
	}
}
