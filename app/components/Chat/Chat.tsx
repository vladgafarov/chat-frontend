import { ScrollArea, Stack } from "@mantine/core"
import { useOutletContext, useParams } from "@remix-run/react"
import type { FC } from "react"
import { useEffect, useState } from "react"
import type { IChatContext } from "~/types/ChatContext"
import type { Message } from "~/types/Message"
import { MessageBubble, SendMessageArea } from "../widgets"

interface Props {
	messages: Message[]
}

const Chat: FC<Props> = ({ messages: defaultMessages }) => {
	const { socket, user } = useOutletContext<IChatContext>()
	const { chatId } = useParams()

	const [messages, setMessages] = useState<Message[]>(defaultMessages)

	useEffect(() => {
		socket.on("SERVER@MESSAGE:ADD", (message) => {
			setMessages((messages) => [...messages, message])
		})

		return () => {
			socket.off("SERVER@MESSAGE:ADD")
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chatId])

	return (
		<ScrollArea
			sx={(theme) => ({
				borderRadius: theme.radius.md,
				flex: "1",
			})}
			mt="md"
			type="always"
		>
			<Stack align="stretch">
				{/* {Array.from({ length: 20 }).map((_, i) => (
					<MessageBubble
						key={i}
						message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed"
						time="2022-09-02T15:29:56.602Z"
						authorId={2}
						userId={Math.random() > 0.5 ? 1 : 2}
					/>
				))} */}

				{messages.map((message, i) => (
					<MessageBubble
						key={i}
						message={message.text}
						time={message.createdAt}
						authorId={message.authorId}
						userId={user.id}
					/>
				))}
			</Stack>
			<SendMessageArea />
		</ScrollArea>
	)
}

export default Chat
