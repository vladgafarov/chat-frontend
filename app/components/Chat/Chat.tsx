import { ScrollArea } from "@mantine/core"
import SendMessageArea from "../widgets/SendMessageArea"

const Chat = () => {
	return (
		<ScrollArea
			sx={(theme) => ({
				height: "100%",
				backgroundColor: theme.colors.gray[1],
				borderRadius: theme.radius.md,
				flex: "1",
			})}
			p="xs"
			mt="md"
			type="always"
		>
			{Array.from({ length: 20 }).map((_, i) => (
				<p key={i}>{i}</p>
			))}
			<SendMessageArea />
		</ScrollArea>
	)
}

export default Chat
