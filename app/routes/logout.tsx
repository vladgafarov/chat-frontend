import type { ActionFunction } from "@remix-run/node"

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData()
	console.log(formData)

	console.log("hey")
	try {
		const res = await fetch(`${process.env.BACKEND_URL}/logout`, {
			method: "POST",
		})
		console.log(res.headers.get("set-cookie"))
	} catch (error) {}

	return null
}
