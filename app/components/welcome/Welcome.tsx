import { Button, Group } from "@mantine/core"
import { useLocation, useNavigate } from "@remix-run/react"
import { motion } from "framer-motion"

const Welcome = () => {
	const navigate = useNavigate()
	const location = useLocation()

	return (
		<>
			<motion.img
				src="/logo.svg"
				alt="Super Chat Logo"
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
				transition={{
					damping: 10,
				}}
				width="128"
				style={{ display: "block", margin: "0 auto" }}
			/>
			<motion.div
				key={location.key}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				<Group grow direction="column" align="center" mt="md">
					<Button onClick={() => navigate("login")}>Log In</Button>
					<Button onClick={() => navigate("signup")}>Sing Up</Button>
				</Group>
			</motion.div>
		</>
	)
}

export default Welcome
