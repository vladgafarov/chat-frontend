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

const getUserSession = (request: Request) => {
	return getSession(request.headers.get("Cookie"))
}

const requireUser = async (request: Request) => {
	const session = await getUserSession(request)
	if (!session.has("access_token") || !session.has("refresh_token")) {
		throw redirect("/welcome")
	}
	return session
}

const checkNoUser = async (request: Request) => {
	const session = await getUserSession(request)
	if (session.has("access_token") || session.has("refresh_token")) {
		throw redirect("/chat")
	}
	return session
}

const getAccessTokenCookie = async (request: Request): Promise<string> => {
	const session = await getUserSession(request)

	return `access_token=${session.get("access_token")}`
}

export {
	getUserSession,
	getSession,
	commitSession,
	destroySession,
	requireUser,
	getAccessTokenCookie,
	checkNoUser,
}
