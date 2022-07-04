import { Link } from "@remix-run/react"

export default function Index() {
	return (
		<>
			<h1>
				Check auth and redirect to <Link to="/welcome/login">login</Link> or{" "}
				<Link to="/chat">chat</Link>
			</h1>
		</>
	)
}
