import type { Session } from "@remix-run/node"
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
		throw redirect("/welcome")
	}
	return session
}

const checkNoUser = async (request: Request) => {
	const session = await getSession(request.headers.get("Cookie"))
	if (session.has("access_token") || session.has("refresh_token")) {
		throw redirect("/chat")
	}
	return session
}

const getAccessTokenCookie = (session: Session): string => {
	return `access_token=${session.get("access_token")}`
}

export {
	getSession,
	commitSession,
	destroySession,
	requireUser,
	getAccessTokenCookie,
	checkNoUser,
}
