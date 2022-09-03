import { Avatar, Group, Title, UnstyledButton } from "@mantine/core"
import { Link } from "@remix-run/react"

interface Props {
	title: string
	link: string
	imageUrl?: string
}

export const UserBubble = ({ link, title, imageUrl }: Props) => {
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
				<Avatar src={imageUrl} radius="xl" />
				<Title order={6}>{title}</Title>
			</Group>
		</UnstyledButton>
	)
}
