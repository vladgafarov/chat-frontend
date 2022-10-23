import { Box } from "@mantine/core"
import type { ActionFunction, LoaderArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import { Navbar } from "~/components/Navbar"
import { useSocket } from "~/hooks/useSocket"
import {
	destroySession,
	getSession,
	getUserSession,
	requireUser,
} from "~/models/auth/session.server"
import { getRooms } from "~/models/room/room.server"
import type { User } from "~/models/user/user.server"
import { getUser } from "~/models/user/user.server"
import type { IChatContext } from "~/types/ChatContext"
import type { Room } from "~/types/Room"

export const loader = async ({ request }: LoaderArgs) => {
	await requireUser(request)

	let user: User
	try {
		user = await getUser(request)
	} catch (err) {
		const session = await getUserSession(request)

		return redirect("/", {
			headers: {
				"Set-Cookie": await destroySession(session),
			},
		})
	}

	if (!user) {
		return redirect("/")
	}

	const rooms = await getRooms(request)

	return json({ user, rooms })
}

export const action: ActionFunction = async ({ request }) => {
	const session = await getSession(request.headers.get("Cookie"))
	const formData = await request.formData()

	if (formData.get("action") === "logout") {
		try {
			await fetch(`${process.env.BACKEND_URL}/logout`, {
				method: "POST",
			})

			return redirect("/welcome", {
				headers: {
					"Set-Cookie": await destroySession(session),
				},
			})
		} catch (error) {
			console.log(error)
		}
	}

	return null
}

export default function Chat() {
	const { user, rooms: loaderRooms } = useLoaderData<typeof loader>()
	const [rooms, setRooms] = useState<Room[]>(loaderRooms)

	const socket = useSocket(user.id)
	const context: IChatContext = {
		socket,
		user,
		rooms,
	}
	const outlet = <Outlet context={context} />

	useEffect(() => {
		socket.on("SERVER@UPDATE-SIDEBAR", (data) => {
			console.log(data)
			setRooms(data.userRooms)
		})

		return () => {
			socket.off("SERVER@UPDATE-SIDEBAR")
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (loaderRooms) {
			setRooms(loaderRooms)
		}
	}, [loaderRooms])

	return (
		<>
			<Navbar user={user} rooms={rooms} />
			<Box
				sx={() => ({
					width: "calc(100% - 300px)",
					marginLeft: "300px",
					minHeight: "100vh",
				})}
				p="md"
			>
				{outlet}
			</Box>
		</>
	)
}
