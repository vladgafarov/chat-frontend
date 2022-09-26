import {
	Avatar,
	Box,
	Group,
	Stack,
	Text,
	Title,
	UnstyledButton,
} from "@mantine/core"
import { Link } from "@remix-run/react"
import { RiGroupLine } from "react-icons/ri"
import type { Message } from "~/types/Message"

interface Props {
	title: string
	link: string
	isGroupChat: boolean
	isActive: boolean
	lastMessage: Message
	userId: number
	countUnreadMessages: number
	imageUrl?: string
}

export const UserBubble = ({
	link,
	title,
	isGroupChat,
	imageUrl,
	isActive,
	lastMessage,
	userId,
	countUnreadMessages,
}: Props) => {
	return (
		<UnstyledButton
			mb="md"
			component={Link}
			to={link}
			sx={(theme) => ({
				width: "100%",
				border: `2px solid ${theme.colors.gray[1]}`,
				borderRadius: theme.radius.md,
				display: "block",
				backgroundColor: isActive ? theme.colors.gray[1] : "white",
			})}
		>
			<Group p={5} noWrap>
				<Avatar src={imageUrl} radius="xl">
					{isGroupChat && <RiGroupLine />}
				</Avatar>
				<Stack
					spacing={0}
					sx={() => ({
						flexGrow: 1,
					})}
				>
					<Title order={6}>{title}</Title>
					{lastMessage?.text && (
						<Text size="sm" color={"gray.6"}>
							{lastMessage.author.id !== userId && (
								<Text weight={500} span>
									{lastMessage.author.name}:{" "}
								</Text>
							)}
							{lastMessage.text.length > 20 ? (
								<>{lastMessage.text.slice(0, 20)}...</>
							) : (
								<>{lastMessage.text}</>
							)}
						</Text>
					)}
				</Stack>
				{countUnreadMessages > 0 && (
					<Box
						sx={(theme) => ({
							backgroundColor: theme.colors.blue[3],
							padding: theme.spacing.xs,
							width: "24px",
							height: "24px",
							fontSize: theme.fontSizes.sm,
							borderRadius: theme.radius.xl,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "whitesmoke",
							alignSelf: "flex-end",
						})}
					>
						<Text>{countUnreadMessages}</Text>
					</Box>
				)}
			</Group>
		</UnstyledButton>
	)
}
