import { Box, Title } from "@mantine/core"
import { useOutletContext, useParams } from "@remix-run/react"
import { useEffect } from "react"
import { Chat } from "~/components/Chat"
import type { IChatContext } from "~/types/ChatContext"

export default function ChatItem() {
	const { socket, user } = useOutletContext<IChatContext>()
	const { chatId } = useParams()

	useEffect(() => {
		socket.emit("CLIENT@ROOM:JOIN", { roomId: chatId, user })

		socket.on("SERVER@ROOM:JOIN", (user) => {
			console.log("SERVER@ROOM:JOIN ", user)
		})

		return () => {
			socket.emit("CLIENT@ROOM:LEAVE", { roomId: chatId, user })
			socket.off("SERVER@ROOM:JOIN")
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chatId])

	return (
		<Box
			sx={(theme) => ({
				height: `calc(100vh - 2 * ${theme.spacing.md}px)`,
				display: "flex",
				flexDirection: "column",
			})}
		>
			<Title order={3}>#{chatId}</Title>
			<Chat />
		</Box>
	)
}
