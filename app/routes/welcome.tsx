import { Box, Group } from "@mantine/core"
import { useOutlet } from "@remix-run/react"
import { AnimatePresence, motion } from "framer-motion"
import WelcomeComponent from "~/components/welcome"

export default function Welcome() {
	const outlet = useOutlet()

	return (
		<Group
			sx={() => ({
				backgroundImage: "url(/auth.png)",
				backgroundSize: "cover",
				height: "100vh",
			})}
			align="center"
			position="center"
		>
			<AnimatePresence exitBeforeEnter initial={false}>
				<Box
					sx={(theme) => ({
						position: "relative",
						borderRadius: theme.radius.lg,
						backgroundColor: theme.fn.rgba("#fff", 0.3),
						backdropFilter: "blur(10px)",
						flexGrow: 0.25,
						[theme.fn.smallerThan("md")]: { flexGrow: 0.9 },
					})}
					p="xl"
					component={motion.div}
					layout
					transition={{ ease: "easeOut" }}
				>
					{!outlet && <WelcomeComponent />}
					{outlet}
				</Box>
			</AnimatePresence>
		</Group>
	)
}
