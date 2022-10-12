import { ActionIcon, createStyles } from "@mantine/core"
import { AnimatePresence } from "framer-motion"
import type { FC } from "react"
import { BsChevronDown } from "react-icons/bs"
import { motion } from "framer-motion"

const useStyles = createStyles((theme) => ({
	root: {
		position: "absolute",
		bottom: 0,
		right: 0,
		zIndex: 100,
		borderRadius: "50%",
		backgroundColor: theme.white,
		border: `1px solid ${theme.colors.gray[3]}`,
	},
}))

interface Props {
	onClick: () => void
	isVisible: boolean
}

export const GoToChatBottom: FC<Props> = ({ onClick, isVisible }) => {
	const { classes } = useStyles()

	return (
		<AnimatePresence>
			{isVisible && (
				<ActionIcon
					onClick={onClick}
					className={classes.root}
					size="lg"
					component={motion.div}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 10 }}
					transition={{ ease: "easeInOut", duration: 0.2 }}
				>
					<BsChevronDown />
				</ActionIcon>
			)}
		</AnimatePresence>
	)
}
