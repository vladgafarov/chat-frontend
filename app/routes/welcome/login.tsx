import { Box, Title } from "@mantine/core"
import { useNavigate } from "@remix-run/react"
import { BsArrowLeft } from "react-icons/bs"
import { arrowStyles } from "~/components/welcome"

export default function Login() {
	const navigate = useNavigate()

	return (
		<Box
			sx={() => ({
				position: "relative",
				textAlign: "center",
			})}
		>
			<Box sx={arrowStyles} onClick={() => navigate("../")}>
				<BsArrowLeft size={23} />
			</Box>
			<Title order={2}>Log In</Title>
		</Box>
	)
}
