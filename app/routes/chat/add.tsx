/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Checkbox, Modal, Stack, TextInput, Title } from "@mantine/core"
import { useDebouncedState } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import type { ActionArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { useFetcher, useNavigate } from "@remix-run/react"
import { useEffect, useState } from "react"
import { BiSearch } from "react-icons/bi"
import { UserItem } from "~/components/widgets"
import { createRoom } from "~/models/room/room.server"
import type { User } from "~/models/user/user.server"
import { searchUser } from "~/models/user/user.server"

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

	const userIdForm = formData.get("userId")
	const isGroupChat = formData.get("isGroupChat") === "true"

	if (!userIdForm) {
		return json({
			error: "No userId provided",
		})
	}

	try {
		const userIds = (userIdForm as string)
			.split(",")
			.map((id) => parseInt(id))

		const res = await createRoom(userIds, isGroupChat, request)

		return redirect(`/chat/${res.id}`)
	} catch (error: any) {
		return json({
			error: error.message,
		})
	}
}

export default function Add() {
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

	const onUserAdd = (user: User) => {
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
	}

	const onUserRemove = (user: User) => {
		setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id))
	}

	const onGroupChatCreate = () => {
		fetcher.submit(
			{
				userId: selectedUsers.map((u) => u.id).join(","),
				isGroupChat: "true",
			},
			{
				method: "post",
			},
		)
	}

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
				onChange={(e) => {
					setSelectedUsers([])
					setIsGroupChat(e.currentTarget.checked)
				}}
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
								onClick={() => onUserRemove(user)}
								isLoading={false}
								isAdding={false}
							/>
						))}
					</Stack>

					<Button onClick={onGroupChatCreate}>
						Create chat with {selectedUsers.length}{" "}
						{selectedUsers.length > 1 ? "users" : "user"}
					</Button>
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
								onClick={() => onUserAdd(user)}
								isLoading={
									fetcher.state === "submitting" &&
									fetcher.data?.id === user.id
								}
								isAdding={true}
							/>
						)
					})}
				</Stack>
			)}
		</Modal>
	)
}
