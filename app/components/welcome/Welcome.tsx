import { Button, Group, Image } from "@mantine/core"
import { useLocation, useNavigate } from "@remix-run/react"
import { motion } from "framer-motion"

const Welcome = () => {
	const navigate = useNavigate()
	const location = useLocation()

	return (
		<motion.div key={location.key}>
			<motion.img
				src="/logo.svg"
				alt="Super Chat Logo"
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
				transition={{
					damping: 10,
					delay: 0.1,
				}}
				width="128"
				height="128"
				style={{ display: "block", margin: "0 auto" }}
			/>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{
					delay: 0.1,
				}}
			>
				<Group grow direction="column" align="center" mt="md">
					<Button onClick={() => navigate("login")}>Log In</Button>
					<Button onClick={() => navigate("signup")}>Sign Up</Button>
				</Group>
			</motion.div>
		</motion.div>
	)
}

export default Welcome
