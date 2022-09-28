import { ActionIcon, createStyles, Menu } from "@mantine/core"
import type { FC } from "react"
import { BsChevronCompactDown } from "react-icons/bs"
import { IoReturnUpForwardOutline } from "react-icons/io5"
import { MdModeEditOutline, MdDelete } from "react-icons/md"

const useStyles = createStyles((theme) => ({
	menuTarget: {
		position: "absolute",
		top: 0,
		right: "3px",
		// opacity: 0,
	},
}))

interface Props {
	className: string
}

const MessageMenu: FC<Props> = ({ className }) => {
	const { classes } = useStyles()

	return (
		<Menu width={200}>
			<Menu.Target>
				<ActionIcon className={className} size="xs">
					<BsChevronCompactDown />
				</ActionIcon>
			</Menu.Target>

			<Menu.Dropdown>
				<Menu.Item icon={<MdModeEditOutline />}>Edit</Menu.Item>
				<Menu.Item icon={<IoReturnUpForwardOutline />} disabled>
					Forward
				</Menu.Item>
				<Menu.Item icon={<MdDelete />} disabled>
					Delete
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	)
}

export default MessageMenu
