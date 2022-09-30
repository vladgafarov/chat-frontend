import { Box, Button, TextInput } from "@mantine/core"
import { shallowEqual, useDebouncedValue } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { useFetcher, useOutletContext, useParams } from "@remix-run/react"
import { useSelector } from "@xstate/react"
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import { useEffect } from "react"
import { BiSend } from "react-icons/bi"
import { useChatContext } from "~/components/Chat/ChatContext"
import type { IChatContext } from "~/types/ChatContext"
import EditMessage from "../EditMessage"

export const SendMessageArea = () => {
	const { socket, user } = useOutletContext<IChatContext>()
	const { chatId } = useParams()

	const chatContext = useChatContext()
	const message = useSelector(
		chatContext.chatService,
		(state) => state.context.message,
	)
	// const messageForEdit = useSelector(
	// 	chatContext.chatService,
	// 	(state) => state.context.messageForEdit,
	// 	shallowEqual,
	// )
	const isEditState = useSelector(chatContext.chatService, (state) =>
		state.matches("editing"),
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

	const updateMessage = () => {
		send({ type: "EDIT.DONE" })
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
		<>
			<Box
				sx={(theme) => ({
					backgroundColor: theme.colors.blue[1],
					borderRadius: theme.radius.md,
				})}
				p="sm"
				// component={motion.div}
				// layout
				// transition={{ ease: "easeOut", duration: 0.2 }}
			>
				{/* <AnimatePresence> */}
				{isEditState && (
					// <motion.div
					// 	initial={{ opacity: 0, y: 5 }}
					// 	animate={{ opacity: 1, y: 0 }}
					// 	exit={{ opacity: 0, y: 5 }}
					// 	transition={{ ease: "easeOut", delay: 0.2 }}
					// >
					<EditMessage />
					// </motion.div>
				)}
				{/* </AnimatePresence> */}
				{/* <motion.div layout> */}
				<sendMessageFetcher.Form
					onSubmit={isEditState ? updateMessage : addMessage}
				>
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
				{/* </motion.div> */}
			</Box>
		</>
	)
}
