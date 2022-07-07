import type { LoaderFunction } from "@remix-run/node"
import { Link } from "@remix-run/react"
import { getSession } from "~/models/auth/session.server"

export const loader: LoaderFunction = async ({ request }) => {
	const session = await getSession(request.headers.get("Cookie"))

	// session.set("user", "test")
	// await commitSession(session)
	console.log(session.data)

	return null
}

export default function Index() {
	return (
		<>
			<h1>
				Check auth and redirect to <Link to="/welcome/login">login</Link> or{" "}
				<Link to="/chat">chat</Link>
			</h1>
			<Link to="/private">private</Link>
		</>
	)
}
