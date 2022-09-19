import { ActionIcon, Avatar, Group, Stack, Text } from "@mantine/core"
import type { FC } from "react"
import { BiMinus, BiPlus } from "react-icons/bi"
import type { User } from "~/models/user/user.server"

interface IProps extends User {
	isLoading: boolean
	isAdding: boolean
	onClick: () => void
}

export const UserItem: FC<IProps> = ({
	email,
	name,
	avatarUrl,
	isLoading,
	isAdding,
	onClick,
}) => {
	return (
		<Group>
			<Avatar src={avatarUrl} radius={"xl"} color="orange">
				{name[0]}
			</Avatar>
			<Stack spacing={0}>
				<Text>{name}</Text>
				<Text color="dimmed" size="sm">
					{email}
				</Text>
			</Stack>
			<ActionIcon
				sx={() => ({
					marginLeft: "auto",
				})}
				title="Create chat"
				onClick={onClick}
				loading={isLoading}
			>
				{isAdding ? <BiPlus /> : <BiMinus />}
			</ActionIcon>
		</Group>
	)
}
