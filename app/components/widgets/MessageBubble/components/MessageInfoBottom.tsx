import { Group, Text, useMantineTheme } from "@mantine/core"
import type { FC } from "react"
import { TbCheck, TbChecks } from "react-icons/tb"

interface Props {
	parsedTime: string
	isRead: boolean
	isAuthorsMessage: boolean
}

const MessageInfoBottom: FC<Props> = ({
	isAuthorsMessage,
	isRead,
	parsedTime,
}) => {
	const theme = useMantineTheme()

	return (
		<Group position="right" spacing={5} ml={"xl"} color="gray">
			<Text size="xs" color="gray">
				{parsedTime}
			</Text>
			{isRead ? (
				<TbChecks color={`${theme.colors["blue"][4]}`} />
			) : isAuthorsMessage ? (
				<TbCheck color={`${theme.colors["gray"][6]}`} />
			) : null}
		</Group>
	)
}

export default MessageInfoBottom
