import { ActionIcon, Button, createStyles, Group, Text } from "@mantine/core"
import { shallowEqual, useSelector } from "@xstate/react"
import { AnimatePresence, motion } from "framer-motion"
import type { FC } from "react"
import { IoReturnUpForwardOutline } from "react-icons/io5"
import { MdClose, MdDelete } from "react-icons/md"
import { useChatContext } from "~/components/Chat/ChatContext"

const useStyles = createStyles((theme) => ({
	base: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		width: "100%",
		backgroundColor: "white",
		borderRadius: theme.radius.md,
		zIndex: 11,
		boxShadow: theme.shadows.sm,
		padding: theme.spacing.md,
		border: `1px solid ${theme.colors.gray[3]}`,
	},
}))

interface Props {}

export const SelectedMesssagesHeader: FC<Props> = () => {
	const { classes } = useStyles()

	const chatContext = useChatContext()
	const { send } = chatContext.chatService

	const selectedMessages = useSelector(
		chatContext.chatService,
		(state) => state.context.selectedMessages,
		shallowEqual,
	)
	const isSelectingState = useSelector(chatContext.chatService, (state) =>
		state.matches("selecting"),
	)

	const cancelSelection = () => {
		send("SELECT.CANCEL")
	}

	return (
		<AnimatePresence>
			{isSelectingState && (
				<motion.div
					className={classes.base}
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 0 }}
				>
					<Group
						position="apart"
						sx={() => ({
							width: "100%",
						})}
					>
						<Text>
							Selected {selectedMessages?.length} message
							{selectedMessages!.length > 1 && "s"}
						</Text>

						<Group>
							<Button
								variant="outline"
								leftIcon={<IoReturnUpForwardOutline />}
							>
								Forward
							</Button>
							<Button variant="outline" leftIcon={<MdDelete />}>
								Delete
							</Button>
							<ActionIcon onClick={cancelSelection}>
								<MdClose />
							</ActionIcon>
						</Group>
					</Group>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
