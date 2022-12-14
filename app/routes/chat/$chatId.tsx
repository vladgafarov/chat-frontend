import {
	ActionIcon,
	Avatar,
	Badge,
	Box,
	Group,
	Modal,
	Stack,
	Text,
	Title,
} from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node"
import {
	json,
	unstable_composeUploadHandlers,
	unstable_createFileUploadHandler,
	unstable_createMemoryUploadHandler,
	unstable_parseMultipartFormData,
} from "@remix-run/node"
import {
	useActionData,
	useLoaderData,
	useOutletContext,
	useParams,
} from "@remix-run/react"
import { useEffect, useMemo, useState } from "react"
import { BsCameraVideoFill } from "react-icons/bs"
import { RiPhoneFill } from "react-icons/ri"
import invariant from "tiny-invariant"
import CallRoom from "~/components/CallRoom"
import { Chat } from "~/components/Chat"
import { addMessage } from "~/models/message/message.server"
import { getRoom } from "~/models/room/room.server"
import type { IChatContext } from "~/types/ChatContext"
import type { Room } from "~/types/Room"

export const meta: MetaFunction = ({ data }: { data: { room: Room } }) => {
	if (!data) {
		return {
			title: "No chat found",
		}
	}

	const { room } = data
	return {
		title: `${room.title} chat`,
	}
}

export const loader = async ({ request, params }: LoaderArgs) => {
	invariant(params.chatId, "chatId is required")

	try {
		const room = await getRoom(params.chatId, request)

		return json({ room })
	} catch (error: any) {
		if (error.message === "404") {
			throw new Response("Not found", { status: 404 })
		}

		throw new Error(error)
	}
}

export const action = async ({ request, params }: ActionArgs) => {
	const formData = await request.clone().formData()

	invariant(params.chatId, "chatId is required")

	if (formData.get("intent") === "add") {
		const uploadHandler = unstable_composeUploadHandlers(
			unstable_createFileUploadHandler({
				maxPartSize: 3_000_000,
				file: ({ filename }) => filename,
			}),
			unstable_createMemoryUploadHandler(),
		)

		const formData = await unstable_parseMultipartFormData(
			request,
			uploadHandler,
		)
		formData.append("roomId", params.chatId)

		try {
			await addMessage(formData, request)

			return json({ message: "ok" })
		} catch (error: any) {
			return json({ error: error.message })
		}
	}

	return null
}

export default function ChatItem() {
	const { room } = useLoaderData<typeof loader>()
	const actionData = useActionData()

	const { socket, user } = useOutletContext<IChatContext>()
	const { chatId } = useParams()

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [isCallModalOpen, setIsCallModalOpen] = useState<boolean>(false)

	const isOnline = useMemo(
		() =>
			(room.isCurrentUserAuthor
				? room.invitedUsers[0].online
				: room.author?.online) && !room.isGroupChat,
		[
			room.author?.online,
			room.invitedUsers,
			room.isCurrentUserAuthor,
			room.isGroupChat,
		],
	)

	const usersWithoutCurrentUser = useMemo(
		() =>
			room.isCurrentUserAuthor
				? room.invitedUsers
				: [room.author, ...room.invitedUsers]
						.filter(Boolean)
						.filter((u) => u?.id !== user.id),
		[room.author, room.invitedUsers, room.isCurrentUserAuthor, user.id],
	)

	useEffect(() => {
		socket.emit("CLIENT@ROOM:JOIN", { roomId: chatId, user })

		socket.on("SERVER@ROOM:JOIN", (user) => {
			console.log("SERVER@ROOM:JOIN ", user)
		})

		// socket.on("SERVER@ROOM:CALL", (data) => {
		// 	console.log("SERVER@ROOM:CALL ", data)
		// })

		return () => {
			socket.emit("CLIENT@ROOM:LEAVE", { roomId: chatId, user })
			socket.off("SERVER@ROOM:JOIN")
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chatId])

	useEffect(() => {
		if (actionData?.error) {
			showNotification({
				title: "Error",
				message: actionData.error,
				color: "red",
			})
		}
	}, [actionData])

	return (
		<Box
			sx={(theme) => ({
				height: `calc(100vh - 2 * ${theme.spacing.md}px)`,
				display: "flex",
				flexDirection: "column",
			})}
		>
			<Group>
				<Title order={3}>
					{room.title}
					{isOnline && (
						<Text span color="gray" size="sm" pl="xs">
							online
						</Text>
					)}
				</Title>

				{room?.isGroupChat && (
					<Avatar.Group
						sx={(theme) => ({
							transition: "all 0.3s ease",
							borderBottom: "1px solid transparent",
							"&:hover": {
								cursor: "pointer",
								borderBottom: `1px solid ${theme.colors.gray[6]}`,
							},
						})}
						onClick={() => setIsModalOpen(true)}
					>
						{room?.invitedUsers.map((user, i) => {
							if (i > 4)
								return (
									<Avatar key={user.id} radius="xl" size="sm">
										+{room.invitedUsers.length - 4}
									</Avatar>
								)

							return (
								<Avatar
									key={user.id}
									src={user.avatarThumbnailUrl}
									alt={user.name}
									radius={"xl"}
									size="sm"
								>
									{user.name[0]}
								</Avatar>
							)
						})}
					</Avatar.Group>
				)}

				<Group spacing={5}>
					<ActionIcon
						size="lg"
						color="dark"
						variant="transparent"
						onClick={() => setIsCallModalOpen(true)}
					>
						<RiPhoneFill size={22} />
					</ActionIcon>
					<ActionIcon size="lg" color="dark" variant="transparent">
						<BsCameraVideoFill size={20} />
					</ActionIcon>
				</Group>
			</Group>

			<Chat messages={room.messages} isGroupChat={room.isGroupChat} />

			<Modal
				opened={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title="Group members"
			>
				<Stack>
					{usersWithoutCurrentUser?.map((user) => {
						if (!user) return null

						return (
							<Group key={user.id}>
								<Avatar
									src={user.avatarThumbnailUrl}
									alt={user.name}
									radius="xl"
								>
									{user.name[0]}
								</Avatar>
								<Group>
									<Text>{user.name}</Text>
									{user.online && (
										<Badge pl="xs" variant="dot" size="sm">
											Online
										</Badge>
									)}
								</Group>
							</Group>
						)
					})}
				</Stack>
			</Modal>

			{isCallModalOpen && (
				<CallRoom
					isOpen={isCallModalOpen}
					onClose={() => setIsCallModalOpen(false)}
				/>
			)}
		</Box>
	)
}

export function CatchBoundary() {
	const { chatId } = useParams()
	return (
		<div>
			<h2>We couldn't find that chat with id {chatId}!</h2>
		</div>
	)
}

export function ErrorBoundary({ error }: { error: Error }) {
	const { chatId } = useParams()

	return (
		<div>
			{`There was an error loading chat by the id ${chatId}. Sorry.`}
			<div>
				<h3>Error</h3>
				<p>{error.message}</p>
				<pre>{error.stack}</pre>
			</div>
		</div>
	)
}
