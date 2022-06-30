import { Group, ScrollArea } from "@mantine/core"
import { MessageBubble, SendMessageArea } from "../widgets"

const Chat = () => {
	return (
		<ScrollArea
			sx={(theme) => ({
				backgroundColor: theme.colors.gray[1],
				borderRadius: theme.radius.md,
				flex: "1",
			})}
			mt="md"
			type="always"
		>
			<Group p="md" direction="column" align="stretch">
				{Array.from({ length: 20 }).map((_, i) => (
					<MessageBubble key={i}>{Math.random()}</MessageBubble>
				))}
			</Group>
			<SendMessageArea />
		</ScrollArea>
	)
}

export default Chat
