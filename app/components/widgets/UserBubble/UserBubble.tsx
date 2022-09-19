import { Avatar, Group, Title, UnstyledButton } from "@mantine/core"
import { Link } from "@remix-run/react"
import { RiGroupLine } from "react-icons/ri"

interface Props {
	title: string
	link: string
	isGroupChat: boolean
	imageUrl?: string
}

export const UserBubble = ({ link, title, isGroupChat, imageUrl }: Props) => {
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
			})}
		>
			<Group p={5}>
				<Avatar src={imageUrl} radius="xl">
					{isGroupChat && <RiGroupLine />}
				</Avatar>
				<Title order={6}>{title}</Title>
			</Group>
		</UnstyledButton>
	)
}
