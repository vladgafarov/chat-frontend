import { ScrollArea, Stack } from "@mantine/core"
import { useOutletContext, useParams } from "@remix-run/react"
import { useEffect, useState } from "react"
import type { IChatContext } from "~/types/ChatContext"
import { MessageBubble, SendMessageArea } from "../widgets"

const Chat = () => {
	const { socket, user } = useOutletContext<IChatContext>()
	const { chatId } = useParams()

	const [messages, setMessages] = useState([])

	useEffect(() => {
		socket.on("SERVER@MESSAGE:ADD", (message) => {
			console.log("SERVER@MESSAGE:ADD ", message)
			setMessages((messages) => [...messages, message])
		})

		return () => {
			socket.off("SERVER@MESSAGE:ADD")
		}
	}, [chatId])

	return (
		<ScrollArea
			sx={(theme) => ({
				backgroundColor: theme.colors.gray[1],
				borderRadius: theme.radius.md,
				flex: "1",
			})}
			mt="md"
			type="always"
		>
			<Stack p="md" align="stretch">
				{messages.map((message, i) => (
					<MessageBubble key={i}>{message.text}</MessageBubble>
				))}
			</Stack>
			<SendMessageArea />
		</ScrollArea>
	)
}

export default Chat
