import type { Socket } from "socket.io-client"
import type { User } from "~/models/user/user.server"
import type { Room } from "./Room"

export interface IChatContext {
	socket: Socket
	user: User
	rooms: Room[]
}
