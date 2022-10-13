import { ScrollArea, Stack, Text } from "@mantine/core"
import { useDebouncedState, useScrollIntoView } from "@mantine/hooks"
import { useOutletContext, useParams } from "@remix-run/react"
import { useInterpret } from "@xstate/react"
import type { FC } from "react"
import { useEffect, useMemo, useState } from "react"
import chatMachine from "~/machines/chatMachine"
import type { IChatContext } from "~/types/ChatContext"
import type { Message } from "~/types/Message"
import {
	GoToChatBottom,
	MessageBubble,
	SelectedMesssagesHeader,
	SendMessageArea,
} from "../widgets"
import { ChatContext } from "./ChatContext"

interface Props {
	messages: Message[]
	isGroupChat: boolean
}

const Chat: FC<Props> = ({ messages: defaultMessages, isGroupChat }) => {
	const { socket, user } = useOutletContext<IChatContext>()
	const { chatId } = useParams()

	const chatService = useInterpret(chatMachine)

	const [messages, setMessages] = useState<Message[]>(defaultMessages)
	const [typingUser, setTypingUser] = useState<string[]>([])
	const [activeMessageId, setActiveMessageId] = useState<number | null>(null)

	const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView({
		duration: 0,
	})
	const [scrollPosition, setScrollPosition] = useDebouncedState(0, 400)

	const isGoToBottomVisible = useMemo(() => {
		const scrollable = scrollableRef.current as any

		const scrollHeight = scrollable?.scrollHeight
		const offsetHeight = scrollable?.offsetHeight

		return scrollHeight - scrollPosition > offsetHeight * 1.33
	}, [scrollPosition, scrollableRef])

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

			if (message.author.id === user.id) {
				scrollIntoView()
			}
		})

		socket.on("SERVER@MESSAGE:IS-TYPING", (data) => {
			if (data.userId !== user.id) {
				setTypingUser((prev) => {
					if (prev.includes(data.name)) return prev
					return [...prev, data.name]
				})
			}
		})

		socket.on("SERVER@MESSAGE:DELETE", (messageId) => {
			setMessages((prev) =>
				prev.filter((message) => message.id !== messageId),
			)
		})

		return () => {
			socket.off("SERVER@MESSAGE:ADD")
			socket.off("SERVER@MESSAGE:IS-TYPING")
			socket.off("SERVER@MESSAGE:DELETE")
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chatId])

	useEffect(() => {
		if (typingUser.length === 0) return

		const timeout = setTimeout(() => {
			setTypingUser((prev) => prev.filter((name) => name !== prev[0]))
		}, 3000)

		return () => {
			clearTimeout(timeout)
		}
	}, [typingUser.length])

	useEffect(() => {
		if (activeMessageId === null) return

		const timeout = setTimeout(() => {
			setActiveMessageId(null)
		}, 1500)

		return () => {
			clearTimeout(timeout)
		}
	}, [activeMessageId])

	return (
		<ChatContext.Provider value={{ chatService }}>
			<ScrollArea
				sx={(theme) => ({
					borderRadius: theme.radius.md,
					flex: "1",
					position: "relative",
				})}
				my="md"
				type="hover"
				viewportRef={scrollableRef}
				onScrollPositionChange={({ y }) => setScrollPosition(y)}
			>
				<SelectedMesssagesHeader />
				<Stack align="stretch">
					{[...messagesByDate.entries()].map(([date, messages]) => (
						<Stack align="stretch" key={date}>
							<Text
								sx={(theme) => ({
									fontSize: theme.fontSizes.sm,
									color: theme.colors.gray[6],
									paddingBlock: theme.spacing.xs,
									position: "sticky",
									top: 0,
									zIndex: 1,
									alignSelf: "center",
								})}
							>
								{date}
							</Text>
							{messages.map((message, i) => {
								const isNextMessageFromSameUser =
									messages[i + 1]?.author.id === message.author?.id
								const isPrevMessageFromSameUser =
									messages[i - 1]?.author.id === message.author?.id

								return (
									<MessageBubble
										key={message.id}
										userId={user.id}
										isGroupChat={isGroupChat}
										isActive={message.id === activeMessageId}
										setIsActiveMessageId={setActiveMessageId}
										isNextMessageFromSameUser={
											isNextMessageFromSameUser
										}
										isPrevMessageFromSameUser={
											isPrevMessageFromSameUser
										}
										{...message}
									/>
								)
							})}
						</Stack>
					))}

					<GoToChatBottom
						onClick={() => scrollIntoView({ alignment: "end" })}
						isVisible={isGoToBottomVisible}
					/>
				</Stack>

				{messages.length === 0 && <Text>No messages yet</Text>}

				{/* @ts-ignore */}
				<div ref={targetRef} />
			</ScrollArea>
			{typingUser.length > 0 && (
				<Text color="gray.6">
					{typingUser.join(", ")} {typingUser.length === 1 ? "is" : "are"}{" "}
					typing...
				</Text>
			)}
			<SendMessageArea />
		</ChatContext.Provider>
	)
}

export default Chat
