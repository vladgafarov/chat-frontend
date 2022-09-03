import { Box, Button, TextInput } from "@mantine/core"
import { useOutletContext, useParams } from "@remix-run/react"
import { useState } from "react"
import { BiSend } from "react-icons/bi"
import type { IChatContext } from "~/types/ChatContext"

const SendMessageButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<Button onClick={onClick} variant="subtle" px="xs" radius={"xs"}>
			<BiSend />
		</Button>
	)
}

export const SendMessageArea = () => {
	const { socket, user } = useOutletContext<IChatContext>()
	const { chatId } = useParams()

	const [message, setMessage] = useState("")

	const addMessage = () => {
		if (!chatId) {
			return
		}

		socket.emit("CLIENT@MESSAGE:ADD", {
			authorId: user.id,
			text: message,
			roomId: +chatId,
		})

		setMessage("")
	}

	return (
		<Box
			sx={(theme) => ({
				backgroundColor: theme.colors.blue[1],
				position: "sticky",
				bottom: "0",
				width: "100%",
				marginInlineStart: "50%",
				transform: "translateX(-50%)",
				zIndex: 1,
			})}
			p="sm"
		>
			<TextInput
				placeholder="Enter a message"
				value={message}
				onChange={(e) => setMessage(e.currentTarget.value)}
				rightSection={<SendMessageButton onClick={addMessage} />}
			/>
		</Box>
	)
}
