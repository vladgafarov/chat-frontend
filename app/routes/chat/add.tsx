/* eslint-disable react-hooks/exhaustive-deps */
import {
	Box,
	Button,
	Checkbox,
	Divider,
	Modal,
	Stack,
	TextInput,
	Title,
} from "@mantine/core"
import { useDebouncedState } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import type { ActionArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { useFetcher, useNavigate, useOutletContext } from "@remix-run/react"
import { useEffect, useState } from "react"
import { BiSearch } from "react-icons/bi"
import { UserItem } from "~/components/widgets"
import { createRoom } from "~/models/room/room.server"
import type { User } from "~/models/user/user.server"
import { searchUser } from "~/models/user/user.server"
import type { IChatContext } from "~/types/ChatContext"

export const action = async ({ request }: ActionArgs) => {
	const formData = await request.formData()

	if (formData.get("intent") === "search") {
		try {
			const res = await searchUser((formData.get("email") as string) || "")

			return json({ users: res })
		} catch (error: any) {
			return json({
				error: error.message,
			})
		}
	}

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
	const searchFetcher = useFetcher()
	const navigate = useNavigate()

	const [searchEmail, setSearchEmail] = useDebouncedState("", 400)

	const [selectedUsers, setSelectedUsers] = useState<User[]>([])
	const [isGroupChat, setIsGroupChat] = useState<boolean>(false)

	const onClose = () => {
		navigate(-1)
	}

	const foundUsers: User[] = searchFetcher.data?.users || []

	useEffect(() => {
		if (!searchEmail) return

		searchFetcher.submit(
			{
				intent: "search",
				email: searchEmail,
			},
			{
				method: "post",
			},
		)
	}, [searchEmail])

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
		<Modal opened={true} onClose={onClose} title="Add chat" size="lg">
			<TextInput
				name="email"
				onChange={(e) => {
					setSearchEmail(e.currentTarget.value)
				}}
				type="search"
				placeholder="Search users"
				icon={<BiSearch />}
				autoComplete="off"
			/>
			<Checkbox
				label="Group chat"
				checked={isGroupChat}
				onChange={(e) => setIsGroupChat(e.currentTarget.checked)}
				mt={"xs"}
			/>

			{selectedUsers.length > 0 && (
				<Stack my="md" spacing={"md"} align="flex-start">
					<Title order={6}>Selected users</Title>
					<Stack
						spacing={"xs"}
						sx={() => ({
							width: "100%",
						})}
					>
						{selectedUsers.map((user) => (
							<UserItem
								key={user.id}
								{...user}
								onClick={() => {
									setSelectedUsers((prev) => {
										const filteredUsers = prev.filter(
											(item) => item.id !== user.id,
										)

										return [...filteredUsers]
									})
								}}
								isLoading={false}
								isAdding={false}
							/>
						))}
					</Stack>

					<Button>
						Create chat with {selectedUsers.length}{" "}
						{selectedUsers.length > 1 ? "users" : "user"}
					</Button>

					<Divider />
				</Stack>
			)}

			{foundUsers.length > 0 && (
				<Stack spacing={"xs"} mt="sm">
					{foundUsers.map((user) => {
						if (selectedUsers.some((item) => item.id === user.id))
							return null

						return (
							<UserItem
								key={user.id}
								{...user}
								onClick={() => {
									if (isGroupChat) {
										setSelectedUsers((prev) => [...prev, user])
									} else {
										fetcher.submit(
											{
												userId: String(user.id),
											},
											{
												method: "post",
											},
										)
									}
								}}
								isLoading={false}
								isAdding={true}
							/>
						)
					})}
				</Stack>
			)}
		</Modal>
	)
}
