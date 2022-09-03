import { Box, Text } from "@mantine/core"
import type { FC } from "react"

interface Props {
	message: string
	time: string
	userId: number
	authorId: number
}

export const MessageBubble: FC<Props> = ({
	message,
	time,
	userId,
	authorId,
}) => {
	const parsedTime = new Date(time).toLocaleTimeString("ru-RU", {
		hour: "numeric",
		minute: "numeric",
	})

	return (
		<Box
			sx={() => ({
				display: "flex",
			})}
		>
			<Box
				sx={(theme) => ({
					backgroundColor:
						authorId === userId
							? theme.colors.blue[1]
							: theme.colors.gray[1],
					borderRadius: theme.radius.md,
					padding: theme.spacing.md,
				})}
			>
				{message}
				<Text size="xs" color={"gray"}>
					{parsedTime}
				</Text>
			</Box>
		</Box>
	)
}
