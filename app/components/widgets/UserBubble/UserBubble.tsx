import {
	Avatar,
	Group,
	Stack,
	Text,
	Title,
	UnstyledButton,
} from "@mantine/core"
import { Link } from "@remix-run/react"
import { RiGroupLine } from "react-icons/ri"
import type { Room } from "~/types/Room"

interface Props {
	title: string
	link: string
	isGroupChat: boolean
	isActive: boolean
	lastMessage: Room["messages"][0]
	userId: number
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
				<Stack spacing={0}>
					<Title order={6}>{title}</Title>
					{lastMessage?.text && (
						<Text
							size="sm"
							color={"gray.6"}
							sx={() => ({
								width: "200px",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
								overflow: "hidden",
							})}
						>
							{lastMessage.author.id !== userId && (
								<Text weight={500} span>
									{lastMessage.author.name}:{" "}
								</Text>
							)}
							{lastMessage.text}
						</Text>
					)}
				</Stack>
			</Group>
		</UnstyledButton>
	)
}
