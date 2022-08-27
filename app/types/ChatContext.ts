import type { Socket } from "socket.io-client"
import type { User } from "~/models/user/user.server"

export interface IChatContext {
	socket: Socket
	user: User
}
