import {
	ActionIcon,
	Button,
	createStyles,
	Group,
	Modal,
	Text,
} from "@mantine/core"
import { useOutletContext, useParams } from "@remix-run/react"
import { shallowEqual, useSelector } from "@xstate/react"
import { AnimatePresence, motion } from "framer-motion"
import type { FC } from "react"
import { useState } from "react"
import { IoReturnUpForwardOutline } from "react-icons/io5"
import { MdClose, MdDelete } from "react-icons/md"
import { useChatContext } from "~/components/Chat/ChatContext"
import type { IChatContext } from "~/types/ChatContext"

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

	const { socket } = useOutletContext<IChatContext>()
	const { chatId } = useParams()

	const [isModalOpen, setIsModalOpen] = useState(false)

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

	const onDelete = () => {
		const userMessages = selectedMessages?.filter(
			(message) => message.isUserAuthor,
		)

		if (userMessages) {
			socket.emit("CLIENT@MESSAGE:DELETE", {
				messageIds: userMessages.map((message) => message.messageId),
				roomId: +(chatId as string),
			})
		}

		send("SELECT.DONE")
		setIsModalOpen(false)
	}

	return (
		<>
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
								<Button
									variant="outline"
									leftIcon={<MdDelete />}
									onClick={() => setIsModalOpen(true)}
								>
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
			<Modal
				opened={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title="Delete your messages?"
			>
				<Group>
					<Button color="red" onClick={onDelete}>
						Delete
					</Button>
					<Button onClick={() => setIsModalOpen(false)} variant="outline">
						Cancel
					</Button>
				</Group>
			</Modal>
		</>
	)
}
