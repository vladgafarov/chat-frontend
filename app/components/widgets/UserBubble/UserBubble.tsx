import { Avatar, Group, Title, UnstyledButton } from "@mantine/core"
import { Link, NavLink } from "@remix-run/react"

interface Props {
	data: {
		username: string
	}
	link: string
}

export const UserBubble = ({ link, data: { username } }: Props) => {
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
			<Group>
				<Avatar src={undefined} radius="xl" />
				<Title order={6}>{username}</Title>
			</Group>
		</UnstyledButton>
	)
}
