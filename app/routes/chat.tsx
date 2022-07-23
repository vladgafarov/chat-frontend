import { Box } from "@mantine/core"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { Outlet } from "@remix-run/react"
import { Navbar } from "~/components/Navbar"
import {
	destroySession,
	getSession,
	requireUser,
} from "~/models/auth/session.server"

export const loader: LoaderFunction = async ({ request }) => {
	await requireUser(request)

	return null
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
	return (
		<>
			<Navbar />
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
