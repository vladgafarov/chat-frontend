import { Button } from "@mantine/core"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { Form, useTransition } from "@remix-run/react"
import {
	destroySession,
	getSession,
	requireUser,
} from "~/models/auth/session.server"

export const loader: LoaderFunction = async ({ request }) => {
	await requireUser(request)

	// const session = await getSession(request.headers.get("Cookie"))

	return null
}

export const action: ActionFunction = async ({ request }) => {
	const session = await getSession(request.headers.get("Cookie"))

	console.log(session.data)

	const res = await fetch(`${process.env.BACKEND_URL}/rooms`, {
		method: "GET",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Cookie: `access_token=${session.get("access_token")}`,
		},
	})
	console.log(res)
	const rooms = await res.json()
	console.log({ rooms })

	return json(rooms)
}

export default function Private() {
	const transition = useTransition()

	return (
		<div>
			<h1>Heeeeelo, stranger</h1>

			<Form method="post">
				<Button type="submit" loading={transition.state === "submitting"}>
					Fetch messages
				</Button>
			</Form>
		</div>
	)
}
