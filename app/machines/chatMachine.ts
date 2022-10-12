import { createMachine, assign } from "xstate"
import type { ChatContext, ChatEvent, ChatTypestate } from "./types"

const chatMachine = createMachine<ChatContext, ChatEvent, ChatTypestate>(
	{
		context: {
			message: "",
			messageForEdit: undefined,
			messageForReply: undefined,
		},
		initial: "initial",
		states: {
			initial: {
				on: {},
			},
			editing: {
				on: {
					"EDIT.DONE": {
						actions: "clearMessages",
						target: "initial",
					},
					"EDIT.CANCEL": {
						actions: "clearMessages",
						target: "initial",
					},
				},
			},
			reply: {
				on: {
					"REPLY.DONE": {
						actions: "clearMessages",
						target: "initial",
					},
					"REPLY.CANCEL": {
						actions: "clearMessages",
						target: "initial",
					},
				},
			},
		},
		on: {
			"MESSAGE.TYPING": {
				actions: "setMessage",
			},
			"MESSAGE.CLEAR": {
				actions: "clearMessage",
			},
			EDIT: {
				actions: "setMessageForEdit",
				target: "editing",
			},
			REPLY: {
				actions: "setMessageForReply",
				target: "reply",
			},
		},
	},
	{
		actions: {
			setMessage: assign({
				message: (context, event) => {
					if (event.type !== "MESSAGE.TYPING") return context.message

					return event.message
				},
			}),
			clearMessage: assign((context) => ({
				message: "",
			})),
			clearMessages: assign((context) => ({
				message: "",
				messageForEdit: undefined,
				messageForReply: undefined,
			})),
			setMessageForEdit: assign((context, event) => {
				if (event.type !== "EDIT") return context

				return {
					message: event.payload.text,
					messageForEdit: {
						messageId: event.payload.messageId,
						text: event.payload.text,
					},
				}
			}),
			setMessageForReply: assign((context, event) => {
				if (event.type !== "REPLY") return context

				return {
					message: "",
					messageForReply: {
						messageId: event.payload.messageId,
						authorName: event.payload.authorName,
						text: event.payload.text,
					},
				}
			}),
		},
	},
)

export default chatMachine
