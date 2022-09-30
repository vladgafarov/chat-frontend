import { Title, Text, Group, ActionIcon } from "@mantine/core"
import { shallowEqual, useSelector } from "@xstate/react"
import type { FC } from "react"
import { IoClose } from "react-icons/io5"
import { useChatContext } from "~/components/Chat/ChatContext"

const EditMessage: FC = () => {
	const chatContext = useChatContext()
	const messageForEdit = useSelector(
		chatContext.chatService,
		(state) => state.context.messageForEdit,
		shallowEqual,
	)
	const { send } = chatContext.chatService

	return (
		<Group position="apart" align="flex-start" noWrap={true} pb="xs">
			<div>
				<Title order={6}>Edit message</Title>

				<Text
					style={{
						wordBreak: "break-word",
					}}
				>
					{messageForEdit?.text}
				</Text>
			</div>

			<ActionIcon
				onClick={() => {
					send({ type: "EDIT.CANCEL" })
				}}
			>
				<IoClose />
			</ActionIcon>
		</Group>
	)
}

export default EditMessage
