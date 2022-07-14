import { createCookieSessionStorage, redirect } from "@remix-run/node"

const { getSession, commitSession, destroySession } =
	createCookieSessionStorage({
		cookie: {
			name: "session",
			path: "/",
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			secrets: ["secret"],
		},
	})

const requireUser = async (request: Request) => {
	const session = await getSession(request.headers.get("Cookie"))
	if (!session.has("access_token") || !session.has("refresh_token")) {
		throw redirect("/")
	}
	return session
}

export { getSession, commitSession, destroySession, requireUser }
