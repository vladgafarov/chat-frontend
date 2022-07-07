import { Button } from "@mantine/core"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { Form, useTransition } from "@remix-run/react"
import { destroySession, getSession } from "~/models/auth/session.server"

export const loader: LoaderFunction = async ({ request }) => {
	const session = await getSession(request.headers.get("Cookie"))

	if (!session.has("access_token") || !session.has("refresh_token")) {
		return redirect("/welcome/login", {
			headers: {
				"Set-Cookie": await destroySession(session),
			},
		})
	}

	return null
}

export const action: ActionFunction = async ({ request }) => {
	// const session = await getSession(request.headers.get("Cookie"))

	const res = await fetch(`${process.env.BACKEND_URL}/rooms`, {
		method: "GET",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
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
