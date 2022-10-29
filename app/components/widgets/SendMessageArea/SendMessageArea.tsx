import { Box, Button, TextInput } from "@mantine/core"
import { shallowEqual, useDebouncedValue } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import { useOutletContext, useParams } from "@remix-run/react"
import { useSelector } from "@xstate/react"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef } from "react"
import { BiSend } from "react-icons/bi"
import { MdOutlineDone } from "react-icons/md"
import { useChatContext } from "~/components/Chat/ChatContext"
import type { IChatContext } from "~/types/ChatContext"
import EditMessage from "../EditMessage"
import ReplyMessage from "../ReplyMessage"

export const SendMessageArea = () => {
	const { socket, user, addMessageFetcher } = useOutletContext<IChatContext>()
	const { chatId } = useParams()

	const inputRef = useRef<HTMLInputElement>()

	const chatContext = useChatContext()
	const message = useSelector(
		chatContext.chatService,
		(state) => state.context.message,
	)
	const messageForEdit = useSelector(
		chatContext.chatService,
		(state) => state.context.messageForEdit,
		shallowEqual,
	)
	const messageForReply = useSelector(
		chatContext.chatService,
		(state) => state.context.messageForReply,
		shallowEqual,
	)
	const isEditState = useSelector(chatContext.chatService, (state) =>
		state.matches("editing"),
	)
	const isReplyState = useSelector(chatContext.chatService, (state) =>
		state.matches("reply"),
	)
	const { send } = chatContext.chatService

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

		// socket.emit("CLIENT@MESSAGE:ADD", {
		// 	authorId: user.id,
		// 	text: message,
		// 	roomId: +chatId,
		// 	repliedMessageId: messageForReply?.messageId,
		// })

		if (messageForReply?.messageId) {
			send({ type: "REPLY.DONE" })
		} else {
			send({ type: "MESSAGE.CLEAR" })
		}
	}

	const updateMessage = () => {
		if (!chatId) {
			return
		}
		if (!isEditState) return

		socket.emit("CLIENT@MESSAGE:UPDATE", {
			roomId: +chatId,
			messageId: messageForEdit!.messageId,
			text: message,
		})

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

	useEffect(() => {
		if (inputRef.current && (isEditState || isReplyState)) {
			const end = inputRef.current.value.length
			inputRef.current.setSelectionRange(end, end)
			inputRef.current.focus()
		}
	}, [isEditState, isReplyState, messageForEdit, messageForReply])

	return (
		<AnimatePresence>
			<Box
				sx={(theme) => ({
					backgroundColor: theme.colors.blue[1],
					borderRadius: theme.radius.md,
				})}
				p="sm"
				component={motion.div}
				layout
				transition={{ ease: "easeInOut", duration: 0.2 }}
			>
				{isEditState && (
					<motion.div
						initial={{ opacity: 0, y: 5 }}
						animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
						exit={{ opacity: 0, y: 5 }}
					>
						<EditMessage />
					</motion.div>
				)}
				{isReplyState && (
					<motion.div
						initial={{ opacity: 0, y: 5 }}
						animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
						exit={{ opacity: 0, y: 5 }}
					>
						<ReplyMessage />
					</motion.div>
				)}
				<motion.div layout>
					<addMessageFetcher.Form
						method="post"
						onSubmit={isEditState ? updateMessage : addMessage}
					>
						<TextInput
							// @ts-ignore
							ref={inputRef}
							name="text"
							placeholder="Enter a message"
							value={message}
							onChange={(e) => {
								send({
									type: "MESSAGE.TYPING",
									message: e.currentTarget.value,
								})
							}}
							autoComplete="off"
							rightSection={
								<Button
									variant="subtle"
									px="xs"
									radius={"xs"}
									type="submit"
									disabled={
										!message || message === messageForEdit?.text
									}
								>
									{isEditState ? <MdOutlineDone /> : <BiSend />}
								</Button>
							}
						/>
					</addMessageFetcher.Form>
				</motion.div>
			</Box>
		</AnimatePresence>
	)
}
