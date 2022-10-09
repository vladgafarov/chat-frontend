interface MessageForEdit {
	messageId: number
	text: string
}

interface MessageForReply {
	messageId: number
	authorName: string
	text: string
}

export interface ChatContext {
	message: string
	messageForEdit?: MessageForEdit
	messageForReply?: MessageForReply
}

export type ChatEvent =
	| { type: "MESSAGE.TYPING"; message: string }
	| { type: "MESSAGE.CLEAR" }
	| {
			type: "EDIT"
			payload: MessageForEdit
	  }
	| {
			type: "EDIT.DONE"
	  }
	| {
			type: "EDIT.CANCEL"
	  }
	| {
			type: "REPLY"
			payload: MessageForReply
	  }
	| {
			type: "REPLY.DONE"
	  }
	| {
			type: "REPLY.CANCEL"
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
	| {
			value: "reply"
			context: ChatContext
	  }
