import {
	Avatar,
	Button,
	Checkbox,
	Group,
	Modal,
	TextInput,
	Title,
} from "@mantine/core"
import { useOutletContext, useParams } from "@remix-run/react"
import { shallowEqual, useSelector } from "@xstate/react"
import type { FC } from "react"
import { useState } from "react"
import { useChatContext } from "~/components/Chat/ChatContext"
import type { IChatContext } from "~/types/ChatContext"

export const ForwardMessageModal: FC = () => {
	const { rooms, socket, user } = useOutletContext<IChatContext>()

	const chatContext = useChatContext()
	const { send } = chatContext.chatService

	const { chatId } = useParams()

	const isForwardingState = useSelector(chatContext.chatService, (state) =>
		state.matches("forwarding"),
	)
	const forwardMessages = useSelector(
		chatContext.chatService,
		(state) => state.context.forwardMessages,
		shallowEqual,
	)

	const [text, setText] = useState("")
	const [selected, setSelected] = useState<string[]>([])

	const onClose = () => {
		send("FORWARD.CANCEL")
	}

	function submit() {
		if (selected.length === 0) return
		if (!chatId) return
		if (forwardMessages?.length === 0) return

		socket.emit("CLIENT@MESSAGE:FORWARD", {
			roomId: +chatId,
			userId: user.id,
			messageIds: forwardMessages?.map((message) => message.messageId),
			roomIds: selected.map((roomId) => Number(roomId)),
			text,
		})

		send("FORWARD.DONE")
		setText("")
		setSelected([])
	}

	const Label = ({ src, title }: { src?: string; title: string }) => (
		<Group spacing="sm">
			<Avatar src={src} radius="xl" />

			<Title order={6}>{title}</Title>
		</Group>
	)

	return (
		<Modal
			title="Forward message"
			opened={isForwardingState}
			onClose={onClose}
		>
			<TextInput
				value={text}
				onChange={(event) => setText(event.currentTarget.value)}
				placeholder="Optional message"
			/>

			<Checkbox.Group
				value={selected}
				onChange={setSelected}
				orientation="vertical"
			>
				{rooms.map((room) => (
					<Checkbox
						key={room.id}
						value={String(room.id)}
						label={<Label title={room.title} />}
						sx={() => ({
							label: {
								flex: "1",
							},
						})}
					/>
				))}
			</Checkbox.Group>

			<Button mt="lg" disabled={selected.length === 0} onClick={submit}>
				Forward to {selected.length} chat{selected.length !== 1 && "s"}
			</Button>
		</Modal>
	)
}
