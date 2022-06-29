import { Box } from "@mantine/core"
import { Outlet } from "@remix-run/react"
import { Navbar } from "~/components/Navbar"

export default function Chat() {
	return (
		<>
			<Navbar />
			<Box
				sx={(theme) => ({
					width: "calc(100% - 300px)",
					marginLeft: "300px",
					minHeight: "100vh",
				})}
				p="md"
			>
				<Outlet />
			</Box>
		</>
	)
}
