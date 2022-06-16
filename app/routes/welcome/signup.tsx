import { Box, Title } from "@mantine/core"
import { useLocation, useNavigate } from "@remix-run/react"
import { motion } from "framer-motion"
import { BsArrowLeft } from "react-icons/bs"
import { arrowStyles } from "~/components/welcome"

export default function Signup() {
	const navigate = useNavigate()
	const location = useLocation()

	return (
		<Box
			key={location.key}
			sx={() => ({
				position: "relative",
				textAlign: "center",
			})}
			component={motion.div}
			initial={{ y: 10, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			exit={{ y: -10, opacity: 0 }}
			transition={{ delay: 0.2, ease: "easeOut" }}
		>
			<Box sx={arrowStyles} onClick={() => navigate("../")}>
				<BsArrowLeft size={23} />
			</Box>
			<Title order={2}>Sign Up</Title>
		</Box>
	)
}
