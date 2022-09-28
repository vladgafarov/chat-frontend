import { Avatar, createStyles, Group, Text } from "@mantine/core"
import { useOutletContext, useParams } from "@remix-run/react"
import type { FC } from "react"
import { useEffect, useRef, useState } from "react"
import useIntersectionObserver from "~/hooks/useIntersectionObserver"
import type { IChatContext } from "~/types/ChatContext"
import type { Message } from "~/types/Message"
import { MessageInfoBottom, MessageMenu, MessageTitle } from "./components"

const useStyles = createStyles(
	(theme, { isAuthorsMessage }: { isAuthorsMessage: boolean }, getRef) => ({
		message: {
			backgroundColor: isAuthorsMessage
				? theme.colors.blue[1]
				: theme.colors.gray[1],
			borderRadius: theme.radius.md,
			paddingBlock: theme.spacing.xs,
			paddingInline: theme.spacing.xs,
			maxWidth: "400px",
			wordBreak: "break-word",
			position: "relative",

			[`&:hover .${getRef("menuTarget")}`]: {
				opacity: 1,
			},
		},
		menuTarget: {
			ref: getRef("menuTarget"),
			position: "absolute",
			top: 0,
			right: "3px",
			opacity: 0,
			transition: "opacity 0.2s ease-in-out",
		},
	}),
)

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
	isReadByCurrentUser: isReadByCurrentUserDefault,
	id,
}) => {
	const { classes } = useStyles({ isAuthorsMessage: userId === author.id })

	const { socket } = useOutletContext<IChatContext>()
	const { chatId } = useParams()
	const ref = useRef<HTMLDivElement>(null)
	const entry = useIntersectionObserver(ref, {})
	const [isReadAuthorMessage, setIsReadAuthorMessage] = useState<boolean>(
		() => {
			return isRead && userId === author.id
		},
	)
	const [isReadByCurrentUser, setIsReadByCurrentUser] = useState<boolean>(
		isReadByCurrentUserDefault,
	)

	const parsedTime = new Date(createdAt).toLocaleTimeString("ru-RU", {
		hour: "numeric",
		minute: "numeric",
	})
	const isVisible = !!entry?.isIntersecting

	useEffect(() => {
		if (isVisible && !isReadByCurrentUser && userId !== author.id) {
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
			if (message.id === id) {
				setIsReadByCurrentUser(true)
			}
		})

		return () => {
			socket.off("SERVER@MESSAGE:READ")
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<Group
			ref={isReadByCurrentUser ? undefined : ref}
			align="flex-start"
			spacing="sm"
		>
			{isGroupChat && (
				<Avatar src={author.avatarUrl} variant="light" radius={"md"}>
					{author.name[0]}
				</Avatar>
			)}
			<div className={classes.message}>
				{isGroupChat && userId !== author.id && (
					<MessageTitle>{author.name}</MessageTitle>
				)}

				<Text>{text}</Text>

				<MessageInfoBottom
					isAuthorsMessage={author.id === userId}
					isRead={isReadAuthorMessage}
					parsedTime={parsedTime}
				/>

				<MessageMenu className={classes.menuTarget} />
			</div>
		</Group>
	)
}
