interface MessageForEdit {
	messageId: number
	text: string
}

interface MessageForReply {
	messageId: number
	authorName: string
	text: string
}

type MessageForSelect = {
	messageId: number
	isUserAuthor: boolean
}

interface ForwardMessage {
	messageId: number
}

export interface ChatContext {
	message: string
	messageForEdit?: MessageForEdit
	messageForReply?: MessageForReply
	selectedMessages?: MessageForSelect[]
	forwardMessages?: ForwardMessage[]
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
	| {
			type: "SELECT"
			payload: {
				messageId: number
				isUserAuthor: boolean
			}
	  }
	| {
			type: "SELECT.DONE"
	  }
	| {
			type: "SELECT.CANCEL"
	  }
	| {
			type: "UNSELECT"
			messageId: number
	  }
	| {
			type: "FORWARD"
			payload: ForwardMessage[]
	  }
	| {
			type: "FORWARD.DONE"
	  }
	| {
			type: "FORWARD.CANCEL"
	  }

export type ChatTypestate =
	| {
			value: "initial"
			context: ChatContext
	  }
	| {
			value: "editing"
			context: ChatContext & {
				messageForEdit: MessageForEdit
			}
	  }
	| {
			value: "reply"
			context: ChatContext & {
				messageForReply: MessageForReply
			}
	  }
	| {
			value: "selecting"
			context: ChatContext & {
				selectedMessages: MessageForSelect[]
			}
	  }
	| {
			value: "forwarding"
			context: ChatContext & {
				forwardMessages: ForwardMessage[]
			}
	  }
