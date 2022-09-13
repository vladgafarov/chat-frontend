import {
	ActionIcon,
	Avatar,
	Checkbox,
	Group,
	Modal,
	Stack,
	Text,
	TextInput,
} from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import type { ActionArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import {
	Form,
	useFetcher,
	useNavigate,
	useOutletContext,
} from "@remix-run/react"
import { useEffect, useState } from "react"
import { BiPlus, BiSearch } from "react-icons/bi"
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
	const navigate = useNavigate()

	const [users, setUsers] = useState<User[]>([])
	const [isGroupChat, setIsGroupChat] = useState<boolean>(false)

	const onClose = () => {
		navigate(-1)
	}

	useEffect(() => {
		// socket?.on("SERVER@USERS:GET", (users) => {
		// 	console.log("SERVER@USERS:GET ", users)
		// 	setUsers(users)
		// })

		socket?.emit("CLIENT@USERS:GET", user, (users: User[]) => {
			setUsers(users)
		})

		// return () => {
		// 	socket?.off("SERVER@USERS:GET")
		// }
	}, [])

	useEffect(() => {
		if (fetcher.data?.error) {
			showNotification({
				title: "Error",
				message: fetcher.data?.error,
				color: "red",
			})
		}
	}, [fetcher.data])

	return (
		<Modal opened={true} onClose={onClose} title="Add chat">
			<TextInput placeholder="Search users" icon={<BiSearch />} />
			<Checkbox
				label="Group chat"
				checked={isGroupChat}
				onChange={(e) => setIsGroupChat(e.currentTarget.checked)}
				mt={"xs"}
			/>

			<Text>Online users</Text>

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
