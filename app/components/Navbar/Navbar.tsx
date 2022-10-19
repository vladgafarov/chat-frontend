import {
	Button,
	Divider,
	Menu,
	Navbar as NavbarUI,
	ScrollArea,
	Title,
} from "@mantine/core"
import { Link, useParams, useSubmit } from "@remix-run/react"
import { useState } from "react"
import { BiExit, BiPlus } from "react-icons/bi"
import { MdSettings } from "react-icons/md"
import type { Socket } from "socket.io-client"
import type { User } from "~/models/user/user.server"
import type { Room } from "~/types/Room"
import SettingsModal from "../SettingsModal"
import { UserBubble } from "../widgets"
import { UserButton } from "./UserButton"

interface Props {
	user: User
	rooms: Room[]
	socket: Socket
}

export function Navbar({ user, rooms, socket }: Props) {
	const submit = useSubmit()
	const { chatId } = useParams()

	const [isSettingsOpen, setIsSettingsOpen] = useState(true)

	return (
		<NavbarUI
			p="xs"
			width={{ base: 300 }}
			fixed
			position={{ top: 0, left: 0 }}
		>
			<NavbarUI.Section>
				<Title order={3}>SuperChat</Title>
			</NavbarUI.Section>
			<Button
				component={Link}
				to="add"
				variant="default"
				color="gray"
				leftIcon={<BiPlus />}
				fullWidth
				my={"md"}
			>
				Add chat
			</Button>
			<NavbarUI.Section grow mt="md" component={ScrollArea}>
				{rooms.map((room) => {
					const isOnline =
						(room.isCurrentUserAuthor
							? room.invitedUsers[0].online
							: room.author.online) && !room.isGroupChat

					return (
						<UserBubble
							key={room.id}
							link={`/chat/${room.id}`}
							title={room.title}
							isGroupChat={room.isGroupChat}
							isActive={room.id === Number(chatId)}
							lastMessage={room.messages[0]}
							userId={user.id}
							countUnreadMessages={room.countUnreadMessages}
							isOnline={isOnline}
						/>
					)
				})}
			</NavbarUI.Section>
			<NavbarUI.Section>
				<Menu position="right">
					<Menu.Target>
						<UserButton name={user.name} email={user.email} />
					</Menu.Target>

					<Menu.Dropdown>
						<Menu.Label>Account</Menu.Label>
						<Menu.Item
							icon={<MdSettings />}
							onClick={() => setIsSettingsOpen(true)}
						>
							Settings
						</Menu.Item>

						<Divider />

						<Menu.Item
							color="red"
							icon={<BiExit />}
							onClick={() => {
								submit({ action: "logout" }, { method: "post" })
							}}
						>
							Exit
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</NavbarUI.Section>

			<SettingsModal
				user={user}
				open={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
			/>
		</NavbarUI>
	)
}
