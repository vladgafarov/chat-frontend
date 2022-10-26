import { ActionIcon, Button, Group, Menu, Modal } from "@mantine/core"
import { useSubmit } from "@remix-run/react"
import type { FC } from "react"
import { useState } from "react"
import { BsChevronCompactDown } from "react-icons/bs"
import { MdDelete } from "react-icons/md"

interface Props {
	className: string
	roomId: number
}

const UserBubbleMenu: FC<Props> = ({ className, roomId }) => {
	const submit = useSubmit()

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

	function onDelete() {
		setIsDeleteModalOpen(false)
		submit(
			{ id: String(roomId) },
			{
				method: "post",
				action: "/resources/leaveRoom",
				replace: true,
			},
		)
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
					<Menu.Item
						icon={<MdDelete />}
						onClick={() => setIsDeleteModalOpen(true)}
					>
						Delete
					</Menu.Item>
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

export default UserBubbleMenu
