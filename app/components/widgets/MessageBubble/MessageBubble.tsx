import { Avatar, Box, Text, Title, useMantineTheme } from "@mantine/core"
import type { FC } from "react"
import { TbCheck, TbChecks } from "react-icons/tb"
import type { Message } from "~/types/Message"

interface Props {
	userId: number
	isGroupChat: boolean
}

export const MessageBubble: FC<Props & Message> = ({
	userId,
	author,
	isGroupChat,
	createdAt,
	text,
	isRead,
}) => {
	const parsedTime = new Date(createdAt).toLocaleTimeString("ru-RU", {
		hour: "numeric",
		minute: "numeric",
	})

	const theme = useMantineTheme()

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
					paddingInline: theme.spacing.xs,
				})}
			>
				{isGroupChat && userId !== author.id && (
					<Title order={6} weight={500}>
						{author.name}
					</Title>
				)}

				{text}
				<Text
					color={"gray"}
					sx={() => ({
						display: "flex",
						justifyContent: "flex-end",
						alignItems: "center",
						gap: "5px",
					})}
				>
					<Text size="xs">{parsedTime}</Text>
					{isRead && userId === author.id ? (
						<TbChecks color={`${theme.colors["blue"][4]}`} />
					) : userId === author.id ? (
						<TbCheck />
					) : null}
				</Text>
			</Box>
		</Box>
	)
}
