import { Box, Title } from "@mantine/core"
import { useParams } from "@remix-run/react"
import { Chat } from "~/components/Chat"

export default function ChatItem() {
	const params = useParams()

	return (
		<Box
			sx={(theme) => ({
				height: `calc(100vh - 2 * ${theme.spacing.md}px)`,
				display: "flex",
				flexDirection: "column",
			})}
		>
			<Title order={3}>Jhon Thomson #{params.chatId}</Title>
			<Chat />
		</Box>
	)
}
