import { Avatar, createStyles, Group, keyframes, Text } from "@mantine/core"
import { useOutletContext, useParams } from "@remix-run/react"
import { shallowEqual, useSelector } from "@xstate/react"
import type { FC } from "react"
import { useEffect, useRef, useState } from "react"
import { useChatContext } from "~/components/Chat/ChatContext"
import useIntersectionObserver from "~/hooks/useIntersectionObserver"
import type { IChatContext } from "~/types/ChatContext"
import type { Message } from "~/types/Message"
import { MessageInfoBottom, MessageMenu, MessageTitle } from "./components"

const highlight = keyframes({
	from: {
		backgroundColor: "rgba(0, 0, 0, 0.1)",
	},
	to: {
		backgroundColor: "rgba(0, 0, 0, 0)",
	},
})

const useStyles = createStyles(
	(
		theme,
		{
			isAuthorsMessage,
			isSelectingState,
		}: { isAuthorsMessage: boolean; isSelectingState: boolean },
		getRef,
	) => ({
		root: {
			cursor: isSelectingState ? "pointer" : "default",
		},
		message: {
			ref: getRef("message"),

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

			a: {
				textDecoration: "none",
				color: "inherit",
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
		reply: {
			borderLeft: `2px solid ${theme.colors.blue[4]}`,
			paddingInline: "7px",
		},
		active: {
			animation: `${highlight} 1.5s ease-in-out`,
			borderRadius: theme.radius.md,
		},
		selected: {
			[`.${getRef("message")}`]: {
				backgroundColor: isAuthorsMessage
					? theme.colors.blue[3]
					: theme.colors.gray[3],
			},
		},
		forwarded: {
			borderLeft: `2px solid ${theme.colors.blue[4]}`,
			paddingInline: "7px",
			marginBottom: theme.spacing.xs,
		},
	}),
)

interface Props {
	userId: number
	isGroupChat: boolean
	isActive: boolean
	setIsActiveMessageId: any
	isNextMessageFromSameUser: boolean
	isPrevMessageFromSameUser: boolean
}

export const MessageBubble: FC<Props & Message> = ({
	userId,
	author,
	isGroupChat,
	createdAt,
	text: textDefault,
	isRead,
	isReadByCurrentUser: isReadByCurrentUserDefault,
	id,
	isEdited: isEditedDefault,
	replyTo,
	isActive,
	setIsActiveMessageId,
	isNextMessageFromSameUser,
	isPrevMessageFromSameUser,
	isForwarded,
	forwardedMessages,
}) => {
	const { socket } = useOutletContext<IChatContext>()
	const { chatId } = useParams()

	const chatContext = useChatContext()
	const { send } = chatContext.chatService
	const selectedMessages = useSelector(
		chatContext.chatService,
		(state) => state.context.selectedMessages,
		shallowEqual,
	)
	const isSelectingState = useSelector(chatContext.chatService, (state) =>
		state.matches("selecting"),
	)

	const { classes, cx } = useStyles({
		isAuthorsMessage: userId === author.id,
		isSelectingState,
	})

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
	const [text, setText] = useState<string>(textDefault)
	const [isEdited, setIsEdited] = useState<boolean>(isEditedDefault)

	const parsedTime = new Date(createdAt).toLocaleTimeString("ru-RU", {
		hour: "numeric",
		minute: "numeric",
	})
	const isVisible = !!entry?.isIntersecting

	const onSelect = () => {
		if (isSelectingState) {
			const isMessageSelected = !!selectedMessages?.some(
				(message) => message.messageId === id,
			)

			if (isMessageSelected) {
				send({
					type: "UNSELECT",
					messageId: id,
				})
			} else {
				send({
					type: "SELECT",
					payload: {
						messageId: id,
						isUserAuthor: userId === author.id,
					},
				})
			}
		}
	}

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

		socket.on("SERVER@MESSAGE:UPDATE", (message: Message) => {
			if (message.id === id) {
				setText(message.text)
				setIsEdited(true)
			}
		})

		return () => {
			socket.off("SERVER@MESSAGE:READ")
			socket.off("SERVER@MESSAGE:UPDATE")
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<Group
			ref={isReadByCurrentUser ? undefined : ref}
			align="flex-end"
			spacing="sm"
			id={String(id)}
			className={cx(classes.root, {
				[classes.active]: isActive,
				[classes.selected]: !!selectedMessages?.some(
					(message) => message.messageId === id,
				),
			})}
			onClick={onSelect}
		>
			{isGroupChat && (
				<Avatar
					src={author.avatarUrl}
					variant="light"
					radius={"md"}
					sx={() => ({
						opacity: isNextMessageFromSameUser ? 0 : 1,
					})}
				>
					{author.name[0]}
				</Avatar>
			)}
			<div className={classes.message}>
				{replyTo && (
					<a
						href={`#${replyTo.id}`}
						onClick={(e) => {
							setIsActiveMessageId(replyTo.id)
						}}
					>
						<div className={classes.reply}>
							<Text size="sm" color="blue" weight={500}>
								{replyTo.author.name}
							</Text>
							<Text size="sm">{replyTo.text}</Text>
						</div>
					</a>
				)}

				{isGroupChat &&
					userId !== author.id &&
					!isPrevMessageFromSameUser && (
						<MessageTitle>{author.name}</MessageTitle>
					)}

				<Text>{text}</Text>

				{isForwarded && (
					<>
						<Text size="sm" color="gray">
							Forwarded message
						</Text>
						{forwardedMessages.map((message) => (
							<div key={message.id} className={classes.forwarded}>
								<Text size="sm" color="blue" weight={500}>
									{message.author.name}
								</Text>

								{message.replyTo && (
									<div className={classes.reply}>
										<Text size="sm" color="blue" weight={500}>
											{message.replyTo.author.name}
										</Text>
										<Text size="sm">{message.replyTo.text}</Text>
									</div>
								)}

								<Text size="sm">{message.text}</Text>
							</div>
						))}
					</>
				)}

				<MessageInfoBottom
					isAuthorsMessage={author.id === userId}
					isRead={isReadAuthorMessage}
					parsedTime={parsedTime}
					isEdited={isEdited}
				/>

				{!isSelectingState && (
					<MessageMenu
						className={classes.menuTarget}
						text={text}
						messageId={id}
						isAuthorsMessage={userId === author.id}
						socket={socket}
						roomId={+(chatId as string)}
						authorName={author.name}
					/>
				)}
			</div>
		</Group>
	)
}
