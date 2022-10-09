import { Title, Text, Group, ActionIcon } from "@mantine/core"
import { shallowEqual, useSelector } from "@xstate/react"
import type { FC } from "react"
import { IoClose } from "react-icons/io5"
import { useChatContext } from "~/components/Chat/ChatContext"

const ReplyMessage: FC = () => {
	const chatContext = useChatContext()
	const messageForReply = useSelector(
		chatContext.chatService,
		(state) => state.context.messageForReply,
		shallowEqual,
	)
	const { send } = chatContext.chatService

	return (
		<Group position="apart" align="flex-start" noWrap={true} pb="xs">
			<div>
				<Title order={6}>Reply message</Title>

				<Title order={6}>{messageForReply?.authorName}</Title>

				<Text
					style={{
						wordBreak: "break-word",
					}}
				>
					{messageForReply?.text}
				</Text>
			</div>

			<ActionIcon
				onClick={() => {
					send({ type: "REPLY.CANCEL" })
				}}
			>
				<IoClose />
			</ActionIcon>
		</Group>
	)
}

export default ReplyMessage
