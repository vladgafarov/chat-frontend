import { ActionIcon, Button, Group, Menu, Modal } from "@mantine/core"
import type { FC } from "react"
import { useState } from "react"
import { BsChevronCompactDown } from "react-icons/bs"
import { CgMailReply } from "react-icons/cg"
import { IoReturnUpForwardOutline } from "react-icons/io5"
import { MdDelete, MdDone, MdModeEditOutline } from "react-icons/md"
import type { Socket } from "socket.io-client"
import { useChatContext } from "~/components/Chat/ChatContext"
interface Props {
	className: string
	messageId: number
	text: string
	isAuthorsMessage: boolean
	socket: Socket
	roomId: number
	authorName: string
}

const MessageMenu: FC<Props> = ({
	className,
	messageId,
	text,
	isAuthorsMessage,
	socket,
	roomId,
	authorName,
}) => {
	const chatContext = useChatContext()
	const { send } = chatContext.chatService

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

	const onDelete = () => {
		socket.emit("CLIENT@MESSAGE:DELETE", {
			messageId,
			roomId,
		})
		setIsDeleteModalOpen(false)
	}

	const sendEdit = () => {
		send({
			type: "EDIT",
			payload: {
				messageId,
				text,
			},
		})
	}
	const sendReply = () => {
		send({
			type: "REPLY",
			payload: {
				messageId,
				authorName,
				text,
			},
		})
	}

	const sendSelect = () => {
		send({
			type: "SELECT",
			messageId,
		})
	}

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
						<Menu.Item icon={<MdModeEditOutline />} onClick={sendEdit}>
							Edit
						</Menu.Item>
					)}
					<Menu.Item icon={<CgMailReply />} onClick={sendReply}>
						Reply
					</Menu.Item>
					<Menu.Item icon={<IoReturnUpForwardOutline />}>
						Forward
					</Menu.Item>
					<Menu.Item icon={<MdDone />} onClick={sendSelect}>
						Select
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
					<Button color="red" onClick={onDelete}>
						Delete
					</Button>
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
