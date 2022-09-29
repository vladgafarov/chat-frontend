import { createContext, useContext } from "react"
import type { InterpreterFrom } from "xstate"
import type chatMachine from "~/machines/chatMachine"

export const ChatContext = createContext({
	chatService: {} as InterpreterFrom<typeof chatMachine>,
})

export const useChatContext = () => {
	return useContext(ChatContext)
}
