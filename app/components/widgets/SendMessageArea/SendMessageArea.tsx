import { Box, Button, TextInput } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { useFetcher, useOutletContext, useParams } from "@remix-run/react"
import { useSelector } from "@xstate/react"
import { useEffect } from "react"
import { BiSend } from "react-icons/bi"
import { useChatContext } from "~/components/Chat/ChatContext"
import type { IChatContext } from "~/types/ChatContext"

export const SendMessageArea = () => {
	const { socket, user } = useOutletContext<IChatContext>()
	const { chatId } = useParams()

	const chatContext = useChatContext()
	const message = useSelector(
		chatContext.chatService,
		(state) => state.context.message,
	)
	const { send } = chatContext.chatService

	const sendMessageFetcher = useFetcher()

	const [debouncedMessage] = useDebouncedValue(message, 200)

	const addMessage = () => {
		if (!chatId) {
			return
		}

		if (!message.trim()) {
			showNotification({
				title: "Message is empty",
				message: "Please, enter your message",
				color: "orange",
			})

			return
		}

		socket.emit("CLIENT@MESSAGE:ADD", {
			authorId: user.id,
			text: message,
			roomId: +chatId,
		})

		send({ type: "MESSAGE.CLEAR" })
	}

	useEffect(() => {
		if (debouncedMessage) {
			socket.emit("CLIENT@MESSAGE:IS-TYPING", {
				userId: user.id,
				name: user.name,
				roomId: +(chatId as string),
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedMessage])

	return (
		<Box
			sx={(theme) => ({
				backgroundColor: theme.colors.blue[1],
				borderRadius: theme.radius.md,
			})}
			p="sm"
		>
			<sendMessageFetcher.Form onSubmit={addMessage}>
				<TextInput
					placeholder="Enter a message"
					value={message}
					onChange={(e) => {
						send({
							type: "MESSAGE.TYPING",
							message: e.currentTarget.value,
						})
					}}
					rightSection={
						<Button
							variant="subtle"
							px="xs"
							radius={"xs"}
							type="submit"
							loading={sendMessageFetcher.state === "loading"}
						>
							<BiSend />
						</Button>
					}
				/>
			</sendMessageFetcher.Form>
		</Box>
	)
}
