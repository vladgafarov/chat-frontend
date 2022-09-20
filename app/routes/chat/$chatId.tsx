import { Box, Title } from "@mantine/core"
import type { LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import {
	useCatch,
	useLoaderData,
	useOutletContext,
	useParams,
} from "@remix-run/react"
import { useEffect, useMemo } from "react"
import invariant from "tiny-invariant"
import { Chat } from "~/components/Chat"
import { getRoom } from "~/models/room/room.server"
import type { IChatContext } from "~/types/ChatContext"

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

export default function ChatItem() {
	const { room } = useLoaderData<typeof loader>()

	const { socket, user } = useOutletContext<IChatContext>()
	const { chatId } = useParams()

	const chatTitle = useMemo(() => {
		if (room?.title) {
			return room.title
		}

		if (room.invitedUsers.length === 1) {
			return room.authorId === user.id
				? room.invitedUsers[0].name
				: room.author.name
		}

		return "Group chat"
	}, [room.author.name, room.authorId, room.invitedUsers, room.title, user.id])

	useEffect(() => {
		socket.emit("CLIENT@ROOM:JOIN", { roomId: chatId, user })

		socket.on("SERVER@ROOM:JOIN", (user) => {
			console.log("SERVER@ROOM:JOIN ", user)
		})

		return () => {
			socket.emit("CLIENT@ROOM:LEAVE", { roomId: chatId, user })
			socket.off("SERVER@ROOM:JOIN")
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chatId])

	return (
		<Box
			sx={(theme) => ({
				height: `calc(100vh - 2 * ${theme.spacing.md}px)`,
				display: "flex",
				flexDirection: "column",
			})}
		>
			<Title order={3}>{chatTitle}</Title>
			<Chat messages={room.messages} />
		</Box>
	)
}

export function CatchBoundary() {
	const caught = useCatch()
	const params = useParams()
	if (caught.status === 404) {
		return <div>Chat does not exist (id "{params.chatId}")</div>
	}
	throw new Error(`Unhandled error: ${caught.status}`)
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
