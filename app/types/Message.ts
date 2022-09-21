export interface Message {
	id: number
	text: string
	createdAt: string
	isRead: boolean
	author: {
		id: number
		name: string
		email: string
		avatarUrl: string
		online: boolean
	}
}
