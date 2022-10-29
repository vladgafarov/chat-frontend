import type { FetcherWithComponents } from "@remix-run/react"
import type { Socket } from "socket.io-client"
import type { User } from "~/models/user/user.server"
import type { Room } from "./Room"

export interface IChatContext {
	socket: Socket
	user: User
	rooms: Room[]
	addMessageFetcher: FetcherWithComponents<any>
}
