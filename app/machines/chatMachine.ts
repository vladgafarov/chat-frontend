import { createMachine, assign } from "xstate"
import type { ChatContext, ChatEvent, ChatTypestate } from "./types"

const chatMachine = createMachine<ChatContext, ChatEvent, ChatTypestate>(
	{
		context: {
			message: "",
			messageForEdit: undefined,
		},
		initial: "initial",
		states: {
			initial: {
				on: {
					EDIT: {
						actions: "setMessageForEdit",
						target: "editing",
					},
				},
			},
			editing: {
				on: {
					EDIT: {
						actions: "setMessageForEdit",
					},
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
		},
		on: {
			"MESSAGE.TYPING": {
				actions: "setMessage",
			},
			"MESSAGE.CLEAR": {
				actions: "clearMessage",
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
			})),
			setMessageForEdit: assign((context, event) => {
				if (event.type !== "EDIT") return context

				return {
					message: event.payload.text,
					messageForEdit: {
						id: event.payload.id,
						text: event.payload.text,
					},
				}
			}),
		},
	},
)

export default chatMachine
