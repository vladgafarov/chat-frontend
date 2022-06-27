import { useParams } from "@remix-run/react"

export default function ChatItem() {
	const params = useParams()

	return (
		<div>
			<h1>Chat</h1>
			<p>{params.chatId}</p>
		</div>
	)
}
