import {
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
}

const BaseMessageBubble: FC<Props> = ({ text, createdAt }) => {
	const { classes } = useStyles()
	const theme = useMantineTheme()

	const parsedTime = new Date(createdAt).toLocaleTimeString("ru-RU", {
		hour: "numeric",
		minute: "numeric",
	})

	return (
		<Stack align="start" mb="md">
			<div className={classes.message}>
				<Text>{text}</Text>

				<Group position="right" spacing={5} ml={"xl"} color="gray">
					<Text size="xs" color="gray">
						{parsedTime}
					</Text>
					<TbCheck color={`${theme.colors["gray"][6]}`} />
				</Group>
			</div>
		</Stack>
	)
}

export default BaseMessageBubble
