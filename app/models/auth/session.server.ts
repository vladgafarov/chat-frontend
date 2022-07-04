import { createCookieSessionStorage } from "@remix-run/node"

const { getSession, commitSession, destroySession } =
	createCookieSessionStorage({
		cookie: {
			name: "session",
		},
	})

export { getSession, commitSession, destroySession }
