import { ScrollArea, Stack, Text } from "@mantine/core"
import { useScrollIntoView } from "@mantine/hooks"
import { useOutletContext, useParams } from "@remix-run/react"
import type { FC } from "react"
import { useMemo } from "react"
import { useEffect, useState } from "react"
import type { IChatContext } from "~/types/ChatContext"
import type { Message } from "~/types/Message"
import { MessageBubble, SendMessageArea } from "../widgets"

interface Props {
	messages: Message[]
	isGroupChat: boolean
}

const Chat: FC<Props> = ({ messages: defaultMessages, isGroupChat }) => {
	const { socket, user } = useOutletContext<IChatContext>()
	const { chatId } = useParams()

	const [messages, setMessages] = useState<Message[]>(defaultMessages)

	const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView()

	//group messages by date
	const messagesByDate = useMemo(() => {
		const messagesByDate = new Map<string, Message[]>()
		messages.forEach((message) => {
			const date = new Date(message.createdAt).toLocaleDateString(
				undefined,
				{
					month: "long",
					day: "numeric",
				},
			)
			const messages = messagesByDate.get(date) || []
			messagesByDate.set(date, [...messages, message])
		})
		return messagesByDate
	}, [messages])

	useEffect(() => {
		setMessages(defaultMessages)
		scrollIntoView({ alignment: "end" })

		socket.on("SERVER@MESSAGE:ADD", (message) => {
			setMessages((messages) => [...messages, message])
		})

		return () => {
			socket.off("SERVER@MESSAGE:ADD")
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chatId])

	return (
		<>
			<ScrollArea
				sx={(theme) => ({
					borderRadius: theme.radius.md,
					flex: "1",
				})}
				my="md"
				type="hover"
				viewportRef={scrollableRef}
			>
				<Stack align="stretch">
					{[...messagesByDate.entries()].map(([date, messages]) => (
						<Stack align="stretch" key={date}>
							<Text
								sx={(theme) => ({
									fontSize: theme.fontSizes.sm,
									color: theme.colors.gray[6],
									paddingBlock: theme.spacing.xs,
								})}
							>
								{date}
							</Text>
							{messages.map((message) => (
								<MessageBubble
									key={message.id}
									userId={user.id}
									isGroupChat={isGroupChat}
									{...message}
								/>
							))}
						</Stack>
					))}

					{/* {messages.map((message, i) => (
						<MessageBubble
							key={i}
							message={message.text}
							time={message.createdAt}
							author={message.author}
							userId={user.id}
							isGroupChat={isGroupChat}
						/>
					))} */}
				</Stack>

				{messages.length === 0 && <Text>No messages yet</Text>}

				{/* @ts-ignore */}
				<div ref={targetRef} />
			</ScrollArea>
			<SendMessageArea />
		</>
	)
}

export default Chat
