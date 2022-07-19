import type { LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { getSession } from "~/models/auth/session.server"

export const loader: LoaderFunction = async ({ request }) => {
	const session = await getSession(request.headers.get("Cookie"))

	if (session.has("access_token") && session.has("refresh_token")) {
		return redirect("/chat")
	}

	return redirect("/welcome")
}
