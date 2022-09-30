import { ActionIcon, Button, Group, Menu, Modal } from "@mantine/core"
import type { FC } from "react"
import { useState } from "react"
import { BsChevronCompactDown } from "react-icons/bs"
import { IoReturnUpForwardOutline } from "react-icons/io5"
import { MdDelete, MdModeEditOutline } from "react-icons/md"
import { useChatContext } from "~/components/Chat/ChatContext"

interface Props {
	className: string
	messageId: number
	text: string
	isAuthorsMessage: boolean
}

const MessageMenu: FC<Props> = ({
	className,
	messageId,
	text,
	isAuthorsMessage,
}) => {
	const chatContext = useChatContext()
	const { send } = chatContext.chatService

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

	return (
		<>
			<Menu width={200}>
				<Menu.Target>
					<ActionIcon className={className} size="xs">
						<BsChevronCompactDown />
					</ActionIcon>
				</Menu.Target>

				<Menu.Dropdown>
					{isAuthorsMessage && (
						<Menu.Item
							icon={<MdModeEditOutline />}
							onClick={() => {
								send({
									type: "EDIT",
									payload: {
										id: messageId,
										text,
									},
								})
							}}
						>
							Edit
						</Menu.Item>
					)}
					<Menu.Item icon={<IoReturnUpForwardOutline />} disabled>
						Forward
					</Menu.Item>
					{isAuthorsMessage && (
						<Menu.Item
							icon={<MdDelete />}
							onClick={() => setIsDeleteModalOpen(true)}
						>
							Delete
						</Menu.Item>
					)}
				</Menu.Dropdown>
			</Menu>
			<Modal
				opened={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				withCloseButton={false}
			>
				Do you want to delete this message?
				<Group mt="lg" spacing="xs">
					<Button color="red">Delete</Button>
					<Button
						variant="outline"
						onClick={() => setIsDeleteModalOpen(false)}
					>
						Cancel
					</Button>
				</Group>
			</Modal>
		</>
	)
}

export default MessageMenu
