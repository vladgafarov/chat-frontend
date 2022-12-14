import { createMachine, assign } from "xstate"
import type { ChatContext, ChatEvent, ChatTypestate } from "./types"

const chatMachine = createMachine<ChatContext, ChatEvent, ChatTypestate>(
	{
		context: {
			message: "",
			messageForEdit: undefined,
			messageForReply: undefined,
			selectedMessages: [],
			forwardMessages: [],
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
			selecting: {
				on: {
					"SELECT.DONE": {
						actions: "clearMessages",
						target: "initial",
					},
					"SELECT.CANCEL": {
						actions: "clearMessages",
						target: "initial",
					},
					UNSELECT: [
						{
							cond: "isLastSelectedMessage",
							actions: "unselectMessage",
							target: "initial",
						},
						{
							actions: "unselectMessage",
						},
					],
				},
			},
			forwarding: {
				on: {
					"FORWARD.DONE": {
						actions: "clearMessages",
						target: "initial",
					},
					"FORWARD.CANCEL": {
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
			SELECT: {
				actions: "addMessageForSelect",
				target: "selecting",
			},
			FORWARD: {
				actions: "addMessagesForForward",
				target: "forwarding",
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
				selectedMessages: [],
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
			addMessageForSelect: assign((context, event) => {
				if (event.type !== "SELECT") return context

				if (!context.selectedMessages) {
					return {
						selectedMessages: [event.payload],
					}
				}

				return {
					selectedMessages: [...context.selectedMessages, event.payload],
				}
			}),
			unselectMessage: assign((context, event) => {
				if (event.type !== "UNSELECT") return context

				return {
					selectedMessages: context.selectedMessages?.filter(
						(message) => message.messageId !== event.messageId,
					),
				}
			}),
			addMessagesForForward: assign((context, event) => {
				if (event.type !== "FORWARD") return context

				return {
					forwardMessages: event.payload,
				}
			}),
		},
		guards: {
			isLastSelectedMessage: (context, event) => {
				if (event.type !== "UNSELECT") return false

				return context.selectedMessages?.length === 1
			},
		},
	},
)

export default chatMachine
