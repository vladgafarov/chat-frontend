export interface ChatContext {
	message: string
	messageForEdit?: {
		id: number
		text: string
	}
}

export type ChatEvent =
	| { type: "MESSAGE.TYPING"; message: string }
	| { type: "MESSAGE.CLEAR" }
	| {
			type: "EDIT"
			payload: {
				id: number
				text: string
			}
	  }
	| {
			type: "EDIT.DONE"
	  }
	| {
			type: "EDIT.CANCEL"
	  }

export type ChatTypestate =
	| {
			value: "initial"
			context: ChatContext
	  }
	| {
			value: "editing"
			context: ChatContext
	  }
