import {
	Button,
	Divider,
	Menu,
	Navbar as NavbarUI,
	ScrollArea,
	Title,
} from "@mantine/core"
import { Link, useSubmit } from "@remix-run/react"
import { BiExit, BiPlus } from "react-icons/bi"
import { MdSettings } from "react-icons/md"
import type { User } from "~/models/user/user.server"
import type { Room } from "~/types/Room"
import { UserBubble } from "../widgets"
import { UserButton } from "./UserButton"

export function Navbar({ user, rooms }: { user: User; rooms: Room[] }) {
	const submit = useSubmit()

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
			<NavbarUI.Section grow mt="md" component={ScrollArea}>
				<Button
					component={Link}
					to="add"
					variant="default"
					color="gray"
					leftIcon={<BiPlus />}
					fullWidth
					mb={"md"}
				>
					Add chat
				</Button>
				{rooms.map((room) => {
					let roomTitle = "Group chat"

					if (room?.title) {
						roomTitle = room.title
					}

					if (room.invitedUsers.length === 1) {
						roomTitle =
							room.authorId === user.id
								? room.invitedUsers[0].name
								: room.author.name
					}

					return (
						<UserBubble
							key={room.id}
							link={`/chat/${room.id}`}
							title={roomTitle}
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
						<Menu.Item icon={<MdSettings />}>Settings</Menu.Item>

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
		</NavbarUI>
	)
}
