import { Avatar, Box, Text, Title } from "@mantine/core"
import type { FC } from "react"
import type { Message } from "~/types/Message"

interface Props {
	message: string
	time: string
	userId: number
	author: Message["author"]
	isGroupChat: boolean
}

export const MessageBubble: FC<Props> = ({
	message,
	time,
	userId,
	author,
	isGroupChat,
}) => {
	const parsedTime = new Date(time).toLocaleTimeString("ru-RU", {
		hour: "numeric",
		minute: "numeric",
	})

	return (
		<Box
			sx={() => ({
				display: "flex",
				gap: "10px",
			})}
		>
			{isGroupChat && (
				<Avatar src={author.avatarUrl} variant="light" radius={"md"}>
					{author.name[0]}
				</Avatar>
			)}
			<Box
				sx={(theme) => ({
					backgroundColor:
						author.id === userId
							? theme.colors.blue[1]
							: theme.colors.gray[1],
					borderRadius: theme.radius.md,
					paddingBlock: theme.spacing.xs,
					paddingInline: theme.spacing.md,
				})}
			>
				{isGroupChat && (
					<Title order={6} weight={500}>
						{author.name}
					</Title>
				)}

				{message}
				<Text size="xs" color={"gray"} align="right">
					{parsedTime}
				</Text>
			</Box>
		</Box>
	)
}
