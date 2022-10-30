import {
	Avatar,
	createStyles,
	Group,
	Stack,
	Text,
	useMantineTheme,
} from "@mantine/core"
import type { FC } from "react"
import { TbCheck } from "react-icons/tb"

const useStyles = createStyles((theme) => ({
	message: {
		backgroundColor: theme.colors.blue[1],
		borderRadius: theme.radius.md,
		paddingBlock: theme.spacing.xs,
		paddingInline: theme.spacing.xs,
		maxWidth: "400px",
		wordBreak: "break-word",
	},
}))

interface Props {
	text: string
	createdAt: string
	avatarUrl?: string | null
	username?: string
}

const BaseMessageBubble: FC<Props> = ({
	text,
	createdAt,
	username,
	avatarUrl,
}) => {
	const { classes } = useStyles()
	const theme = useMantineTheme()

	const parsedTime = new Date(createdAt).toLocaleTimeString("ru-RU", {
		hour: "numeric",
		minute: "numeric",
	})

	return (
		<Stack align="start" mb="md">
			<Group align="flex-end" spacing="sm">
				{username && (
					<Avatar src={avatarUrl} variant="light" radius={"md"}>
						{username[0]}
					</Avatar>
				)}
				<div className={classes.message}>
					<Text>{text}</Text>

					<Group position="right" spacing={5} ml={"xl"} color="gray">
						<Text size="xs" color="gray">
							{parsedTime}
						</Text>
						<TbCheck color={`${theme.colors["gray"][6]}`} />
					</Group>
				</div>
			</Group>
		</Stack>
	)
}

export default BaseMessageBubble
