import { Avatar, Button, Checkbox, Group, Modal, Title } from "@mantine/core"
import { useSelector } from "@xstate/react"
import type { FC } from "react"
import { useState } from "react"
import { useChatContext } from "~/components/Chat/ChatContext"

export const ForwardMessageModal: FC = () => {
	const chatContext = useChatContext()
	const { send } = chatContext.chatService

	const isForwardingState = useSelector(chatContext.chatService, (state) =>
		state.matches("forwarding"),
	)

	const onClose = () => {
		send("FORWARD.CANCEL")
	}

	const [value, setValue] = useState<string[]>([])

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
				value={value}
				onChange={setValue}
				orientation="vertical"
			>
				<Checkbox
					value="react"
					label={<Label title="Jhon" />}
					sx={() => ({
						label: {
							flex: "1",
						},
					})}
				/>
			</Checkbox.Group>

			<Button mt="lg" disabled={value.length === 0}>
				Forward to {value.length} chat{value.length !== 1 && "s"}
			</Button>
		</Modal>
	)
}
