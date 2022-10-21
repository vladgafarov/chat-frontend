import { createContext } from "react"
import type { InterpreterFrom } from "xstate"
import type { avatarMachine } from "~/machines"

export const AvatarContext = createContext({
	avatarService: {} as InterpreterFrom<typeof avatarMachine>,
})
