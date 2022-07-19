import { Box } from "@mantine/core"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { Form, Outlet } from "@remix-run/react"
import { Navbar } from "~/components/Navbar"
import { requireUser } from "~/models/auth/session.server"

export const loader: LoaderFunction = async ({ request }) => {
	await requireUser(request)

	return null
}

export const action: ActionFunction = async ({ request }) => {
	console.log("hey")
	try {
		const res = await fetch(`${process.env.BACKEND_URL}/logout`, {
			method: "POST",
		})
		console.log(res.headers.get("set-cookie"))
	} catch (error) {}
}

export default function Chat() {
	return (
		<>
			<Navbar />
			<Box
				sx={(theme) => ({
					width: "calc(100% - 300px)",
					marginLeft: "300px",
					minHeight: "100vh",
				})}
				p="md"
			>
				<Form method="post">
					<button type="submit">logout</button>
				</Form>
				<Outlet />
			</Box>
		</>
	)
}
