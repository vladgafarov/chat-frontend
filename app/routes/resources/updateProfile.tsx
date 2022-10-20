import type { ActionArgs } from "@remix-run/node"
import {
	json,
	unstable_composeUploadHandlers,
	unstable_createFileUploadHandler,
	unstable_createMemoryUploadHandler,
	unstable_parseMultipartFormData,
} from "@remix-run/node"
import { updateProfile } from "~/models/user/user.server"

export const action = async ({ request }: ActionArgs) => {
	const uploadHandler = unstable_composeUploadHandlers(
		unstable_createFileUploadHandler({
			maxPartSize: 3_000_000,
			file: ({ filename }) => filename,
		}),
		unstable_createMemoryUploadHandler(),
	)

	const formData = await unstable_parseMultipartFormData(
		request,
		uploadHandler,
	)

	try {
		const res = await updateProfile(formData, request)

		return json(res)
	} catch (e: any) {
		return json({ error: e.message })
	}
}
