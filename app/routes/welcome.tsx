import { Box, Center } from "@mantine/core"
import type { LoaderFunction } from "@remix-run/node"
import { useOutlet } from "@remix-run/react"
import { AnimatePresence, motion } from "framer-motion"
import WelcomeComponent from "~/components/welcome"
import { checkNoUser } from "~/models/auth/session.server"

export const loader: LoaderFunction = async ({ request }) => {
	await checkNoUser(request)

	return null
}

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
					backgroundColor: theme.fn.rgba("#fff", 0.7),
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
