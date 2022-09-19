export interface Message {
	id: number
	text: string
	createdAt: string
	author: {
		id: number
		name: string
		email: string
		avatarUrl: string
		online: boolean
	}
}
