export interface Message {
	id: number
	text: string
	createdAt: string
	isRead: boolean
	isReadByCurrentUser: boolean
	authorId: number
	isEdited: boolean
	replyTo: {
		id: number
		text: string
		author: {
			id: number
			name: string
		}
	}
	author: {
		id: number
		name: string
		email: string
		avatarUrl: string
		online: boolean
	}
}
