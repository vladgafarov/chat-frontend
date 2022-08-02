import { Box } from "@mantine/core"
import type { ActionFunction, LoaderArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import { Navbar } from "~/components/Navbar"
import {
	destroySession,
	getSession,
	requireUser,
} from "~/models/auth/session.server"
import { getUser } from "~/models/user/user.server"

export const loader = async ({ request }: LoaderArgs) => {
	await requireUser(request)

	//TODO try catch
	const user = await getUser(request)

	if (!user) {
		return redirect("/")
	}

	return json({ user })
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
	const { user } = useLoaderData<typeof loader>()

	return (
		<>
			<Navbar user={user} />
			<Box
				sx={() => ({
					width: "calc(100% - 300px)",
					marginLeft: "300px",
					minHeight: "100vh",
				})}
				p="md"
			>
				<Outlet />
			</Box>
		</>
	)
}
