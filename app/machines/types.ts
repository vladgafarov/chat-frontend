interface MessageForEdit {
	messageId: number
	text: string
}

interface MessageForReply {
	messageId: number
	authorName: string
	text: string
}

type MessageForSelect = number

export interface ChatContext {
	message: string
	messageForEdit?: MessageForEdit
	messageForReply?: MessageForReply
	selectedMessages?: MessageForSelect[]
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
			messageId: number
	  }
	| {
			type: "SELECT.CANCEL"
	  }
	| {
			type: "UNSELECT"
			messageId: number
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
