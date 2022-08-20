import { ActionIcon, Avatar, Group, Modal, Stack, Text } from "@mantine/core"
import type { ActionArgs } from "@remix-run/node"
import { useNavigate, useOutletContext } from "@remix-run/react"
import { useEffect, useState } from "react"
import { BiPlus } from "react-icons/bi"
import type { User } from "~/models/user/user.server"
import type { IChatContext } from "~/types/ChatContext"

export const action = async ({ request }: ActionArgs) => {}

export default function Add() {
	const { socket } = useOutletContext<IChatContext>()

	const [users, setUsers] = useState<User[]>([])

	const navigate = useNavigate()

	const onClose = () => {
		navigate("/chat")
	}

	useEffect(() => {
		socket?.on("SERVER@USERS:GET", (users) => {
			console.log("SERVER@USERS:GET ", users)
			setUsers(users)
		})
		socket?.emit("CLIENT@USERS:GET")

		return () => {
			socket?.off("SERVER@USERS:GET")
		}
	}, [])

	return (
		<Modal opened={true} onClose={onClose} title="Add chat">
			<Text>Online users</Text>

			<Stack
				spacing={"xs"}
				sx={(theme) => ({
					marginTop: theme.spacing.xs,
				})}
			>
				{users &&
					users.map(({ id, name }) => (
						<Group key={id}>
							<Avatar radius={"xl"} color="orange">
								{name[0]}
							</Avatar>
							<Text>{name}</Text>
							<ActionIcon
								sx={() => ({
									marginLeft: "auto",
								})}
								title="Create chat"
							>
								<BiPlus />
							</ActionIcon>
						</Group>
					))}
			</Stack>
		</Modal>
	)
}
