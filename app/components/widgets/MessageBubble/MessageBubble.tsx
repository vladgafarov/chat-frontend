import { Avatar, Box, Text, Title, useMantineTheme } from "@mantine/core"
import { useOutletContext, useParams } from "@remix-run/react"
import type { FC } from "react"
import { useEffect, useRef, useState } from "react"
import { TbCheck, TbChecks } from "react-icons/tb"
import useIntersectionObserver from "~/hooks/useIntersectionObserver"
import type { IChatContext } from "~/types/ChatContext"
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
	id,
}) => {
	const { socket } = useOutletContext<IChatContext>()
	const { chatId } = useParams()
	const theme = useMantineTheme()
	const ref = useRef<HTMLDivElement>(null)
	const entry = useIntersectionObserver(ref, {})
	const [isReadAuthorMessage, setIsReadAuthorMessage] = useState<boolean>(
		() => {
			return isRead && userId === author.id
		},
	)

	const parsedTime = new Date(createdAt).toLocaleTimeString("ru-RU", {
		hour: "numeric",
		minute: "numeric",
	})
	const isVisible = !!entry?.isIntersecting

	useEffect(() => {
		if (isVisible && !isRead && userId !== author.id) {
			console.log("CLIENT@MESSAGE:READ", id)

			socket.emit("CLIENT@MESSAGE:READ", {
				id: Number(id),
				userWhoReadId: Number(userId),
				roomId: Number(chatId),
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isVisible])

	useEffect(() => {
		socket.on("SERVER@MESSAGE:READ", (message: Message) => {
			if (message.id === id && message.authorId === userId && !isRead) {
				setIsReadAuthorMessage(true)
			}
		})

		return () => {
			socket.off("SERVER@MESSAGE:READ")
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<Box
			sx={() => ({
				display: "flex",
				gap: "10px",
			})}
			ref={isRead ? undefined : ref}
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
					{isReadAuthorMessage ? (
						<TbChecks color={`${theme.colors["blue"][4]}`} />
					) : userId === author.id ? (
						<TbCheck />
					) : null}
				</Text>
			</Box>
		</Box>
	)
}
