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
import { UserBubble } from "../widgets"
import { UserButton } from "./UserButton"

export function Navbar({ user }: { user: User }) {
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
				>
					Add chat
				</Button>
				{/* {Array.from({ length: 10 }).map((_, i) => (
					<UserBubble
						key={i}
						link={`/chat/${i}`}
						data={{
							username: "Jhon Thomson",
						}}
					/>
				))} */}
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
