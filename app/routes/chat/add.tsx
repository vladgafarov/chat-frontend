import { ActionIcon, Avatar, Group, Modal, Stack, Text } from "@mantine/core"
import type { ActionArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import {
	Form,
	useFetcher,
	useNavigate,
	useOutletContext,
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

		return redirect(`/chat/${res.id}`)
	} catch (error: any) {
		return json({
			error: error.message,
		})
	}
}

export default function Add() {
	const { socket, user } = useOutletContext<IChatContext>()

	const fetcher = useFetcher()

	const [users, setUsers] = useState<User[]>([])

	const navigate = useNavigate()

	const onClose = () => {
		navigate(-1)
	}

	useEffect(() => {
		socket?.on("SERVER@USERS:GET", (users) => {
			console.log("SERVER@USERS:GET ", users)
			setUsers(users)
		})

		socket?.emit("CLIENT@USERS:GET", user)

		return () => {
			socket?.off("SERVER@USERS:GET")
		}
	}, [])

	return (
		<Modal opened={true} onClose={onClose} title="Add chat">
			<Text>Online users</Text>

			{fetcher.data?.error && <Text color="red">{fetcher.data?.error}</Text>}

			{users && users.length > 0 ? (
				<Form>
					<Stack
						spacing={"xs"}
						sx={(theme) => ({
							marginTop: theme.spacing.xs,
						})}
					>
						{users.map(({ id, name, email }) => (
							<Group key={id}>
								<Avatar radius={"xl"} color="orange">
									{name[0]}
								</Avatar>
								<Text>{email}</Text>
								<ActionIcon
									sx={() => ({
										marginLeft: "auto",
									})}
									title="Create chat"
									onClick={() => {
										fetcher.submit(
											{ userId: String(id) },
											{ method: "post" },
										)
									}}
									loading={
										fetcher.state === "submitting" &&
										fetcher.submission.formData.get("userId") ===
											String(id)
									}
								>
									<BiPlus />
								</ActionIcon>
							</Group>
						))}
					</Stack>
				</Form>
			) : (
				<Text color="gray">No online users</Text>
			)}
		</Modal>
	)
}
