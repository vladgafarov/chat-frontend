import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { json } from "@remix-run/node"
import { leaveRoom } from "~/models/room/room.server"

export const loader = async ({ request }: LoaderArgs) => {
	throw redirect("/chat")
}

export const action = async ({ request }: ActionArgs) => {
	const formData = await request.formData()
	const data = Object.fromEntries(formData) as { id: string }

	try {
		await leaveRoom(+data.id, request)

		return redirect("/chat")
	} catch (error: any) {
		return json({ error: error.message })
	}
}
