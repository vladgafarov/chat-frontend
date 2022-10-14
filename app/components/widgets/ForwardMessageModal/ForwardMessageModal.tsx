import { Avatar, Button, Checkbox, Group, Modal, Title } from "@mantine/core"
import { useOutletContext } from "@remix-run/react"
import { useSelector } from "@xstate/react"
import type { FC } from "react"
import { useState } from "react"
import { useChatContext } from "~/components/Chat/ChatContext"
import type { IChatContext } from "~/types/ChatContext"

export const ForwardMessageModal: FC = () => {
	const { rooms } = useOutletContext<IChatContext>()

	const chatContext = useChatContext()
	const { send } = chatContext.chatService

	const isForwardingState = useSelector(chatContext.chatService, (state) =>
		state.matches("forwarding"),
	)

	const onClose = () => {
		send("FORWARD.CANCEL")
	}

	const [selected, setSelected] = useState<string[]>([])

	function submit() {}

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
