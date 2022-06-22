import { Box, Center } from "@mantine/core"
import { useOutlet } from "@remix-run/react"
import { AnimatePresence, motion } from "framer-motion"
import WelcomeComponent from "~/components/welcome"

export default function Welcome() {
	const outlet = useOutlet()

	return (
		<Center
			sx={() => ({
				backgroundImage: "url(/auth.png)",
				backgroundSize: "cover",
				height: "100vh",
			})}
		>
			<Box
				sx={(theme) => ({
					position: "relative",
					borderRadius: theme.radius.lg,
					backgroundColor: theme.fn.rgba("#fff", 0.3),
					backdropFilter: "blur(10px)",
					width: "420px",
				})}
				p="xl"
				component={motion.div}
				layout
				transition={{ ease: "easeOut" }}
			>
				<AnimatePresence exitBeforeEnter initial={false}>
					{!outlet ? <WelcomeComponent /> : outlet}
				</AnimatePresence>
			</Box>
		</Center>
	)
}
