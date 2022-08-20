import { useEffect, useRef } from "react"
import type { Socket } from "socket.io-client"
import { io } from "socket.io-client"
import type { User } from "~/models/user/user.server"

export const useSocket = (userId: User["id"]) => {
	const socketRef = useRef<Socket>()

	if (!socketRef.current) {
		// socketRef.current =
		// 	typeof window !== "undefined"
		// 		? io("http://localhost:3000", {
		// 				auth: {
		// 					userId,
		// 				},
		// 		  })
		// 		: undefined
		socketRef.current = io("http://localhost:3000", {
			auth: {
				userId,
			},
		})
		console.log("connect")
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
