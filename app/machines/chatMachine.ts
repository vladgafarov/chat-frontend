import { createMachine, assign } from "xstate"
import type { ChatContext, ChatEvent, ChatTypestate } from "./types"

const chatMachine =
	/** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgNwBdd0AbAYgFEARASQBVFQAHAe1ktw98nEAA9EARgAsAZhIA2RYoCsABgDsADnlStUgDQgAnpM0AmEqquqJZjcrPqJMqQF9XhtFjyFSkAfhQjKxsJEwA8gByDCK8-FRCIiYIEgCc8pbWqlJSmlLOqYbiCGoSJDLKyjLyGupuHiBeOATEJP5UgcHsJADCAIKRPQwAMrF8AolIYoil5ZXVtQbGkrmZ1jl5Be6eGM2+dACyDADKx30A4gwkbACaAAoskedj8YLCU8USymWpNqrK6nU8gk6l+MkMyVs20aux8xEOJzOl16wwYfQASi8Ju9QMlUsoSE40qltJUzJovpoiogdATUjknPIzFJHMp3A18DwIHARE04aRyFRaFiEjjpghdBDJOk1lYNvkZKloXyWn4IAEoCK3iJijIZBYZJplLobKDvkCpSkZVlsrkFUqGirfFrJqBimZwcsEEC1hJVMDculFJp2a4gA */
	createMachine<ChatContext, ChatEvent, ChatTypestate>(
		{
			context: {
				message: "",
				messageForEdit: "",
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
					messageForEdit: "",
				})),
				setMessageForEdit: assign({
					messageForEdit: (context, event) => {
						if (event.type !== "EDIT") return context.messageForEdit

						return event.messageForEdit
					},
				}),
			},
		},
	)

export default chatMachine
