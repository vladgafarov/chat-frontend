import { ActionIcon, Avatar, Group, Modal, Stack, Text } from "@mantine/core"
import type { ActionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import {
	Form,
	useNavigate,
	useOutletContext,
	useSubmit,
	useTransition,
} from "@remix-run/react"
import { useEffect, useState } from "react"
import { BiPlus } from "react-icons/bi"
import { createRoom } from "~/models/room/room.server"
import type { User } from "~/models/user/user.server"
import type { IChatContext } from "~/types/ChatContext"

export const action = async ({ request }: ActionArgs) => {
	const formData = await request.formData()
	const userId = formData.get("userId")

	if (!userId) {
		return json({
			error: "No userId provided",
		})
	}

	try {
		const res = await createRoom([+userId], request)

		console.log(res)
	} catch (error) {
		console.log(error)
	}

	return null
}

export default function Add() {
	const { socket } = useOutletContext<IChatContext>()

	const submit = useSubmit()
	const transition = useTransition()

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

			{users && (
				<Form>
					<Stack
						spacing={"xs"}
						sx={(theme) => ({
							marginTop: theme.spacing.xs,
						})}
					>
						{users.map(({ id, name }) => (
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
									onClick={() => {
										submit({ userId: String(id) }, { method: "post" })
									}}
									loading={
										transition.state === "submitting" &&
										transition.submission.formData.get("userId") ===
											String(id)
									}
								>
									<BiPlus />
								</ActionIcon>
							</Group>
						))}
					</Stack>
				</Form>
			)}
		</Modal>
	)
}
