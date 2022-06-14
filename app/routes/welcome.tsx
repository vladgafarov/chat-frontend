import { Box, Button, Container, Group } from "@mantine/core"
import { useLocation, useNavigate, useOutlet } from "@remix-run/react"
import { AnimatePresence, motion } from "framer-motion"
import WelcomeComponent from "~/components/welcome"

export default function Welcome() {
	const navigate = useNavigate()
	const outlet = useOutlet()
	const location = useLocation()

	return (
		<Group
			sx={(theme) => ({
				backgroundImage: "url(/auth.png)",
				backgroundSize: "cover",
				height: "100vh",
			})}
			align="center"
			position="center"
		>
			<AnimatePresence exitBeforeEnter initial={false}>
				<Container
					sx={(theme) => ({
						position: "relative",
						borderRadius: theme.radius.lg,
						backgroundColor: theme.fn.rgba("#fff", 0.3),
						backdropFilter: "blur(10px)",
						flexGrow: 1,
					})}
					size="xs"
					p="xl"
				>
					{!outlet && <WelcomeComponent />}
					<motion.div
						key={location.key}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						{outlet}
					</motion.div>
				</Container>
			</AnimatePresence>
		</Group>
	)
}
