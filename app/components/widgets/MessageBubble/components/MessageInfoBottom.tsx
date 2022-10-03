import { Group, Text, useMantineTheme } from "@mantine/core"
import type { FC } from "react"
import { MdModeEditOutline } from "react-icons/md"
import { TbCheck, TbChecks } from "react-icons/tb"

interface Props {
	parsedTime: string
	isRead: boolean
	isAuthorsMessage: boolean
	isEdited: boolean
}

const MessageInfoBottom: FC<Props> = ({
	isAuthorsMessage,
	isRead,
	parsedTime,
	isEdited,
}) => {
	const theme = useMantineTheme()

	return (
		<Group position="right" spacing={5} ml={"xl"} color="gray">
			{isEdited && (
				<Text color="gray" size="xs" py={0}>
					<MdModeEditOutline />
				</Text>
			)}
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
