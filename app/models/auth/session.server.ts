import { createCookieSessionStorage } from "@remix-run/node"

const { getSession, commitSession, destroySession } =
	createCookieSessionStorage({
		cookie: {
			name: "session",
			maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
			path: "/",
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			secrets: ["secret"],
		},
	})

export { getSession, commitSession, destroySession }
