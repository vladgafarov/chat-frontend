import { useEffect, useRef } from "react"
import type { Socket } from "socket.io-client"
import { io } from "socket.io-client"

export const useSocket = () => {
	const socketRef = useRef<Socket>()

	if (!socketRef.current) {
		socketRef.current =
			typeof window !== "undefined" ? io("http://localhost:3000") : undefined
	} else {
		socketRef.current.connect()
	}

	useEffect(() => {
		return () => {
			if (socketRef.current) {
				console.log("disconnect!!!")
				socketRef.current.disconnect()
			}
		}
	}, [])

	return socketRef.current
}
