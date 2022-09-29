import { ActionIcon, Menu } from "@mantine/core"
import type { FC } from "react"
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

	return (
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
							send({ type: "EDIT", text })
						}}
					>
						Edit
					</Menu.Item>
				)}
				<Menu.Item icon={<IoReturnUpForwardOutline />} disabled>
					Forward
				</Menu.Item>
				{isAuthorsMessage && (
					<Menu.Item icon={<MdDelete />} disabled>
						Delete
					</Menu.Item>
				)}
			</Menu.Dropdown>
		</Menu>
	)
}

export default MessageMenu
