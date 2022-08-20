import { useContext } from "react"
import { SocketContext } from "~/components/SocketContext/SocketContext"

export const useSocketContext = () => {
	return useContext(SocketContext)
}
