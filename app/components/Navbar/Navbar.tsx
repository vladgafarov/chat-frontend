import {
	Divider,
	Menu,
	Navbar as NavbarUI,
	ScrollArea,
	Title,
} from "@mantine/core"
import type { ActionFunction } from "@remix-run/node"
import { Form } from "@remix-run/react"
import { BiExit } from "react-icons/bi"
import { MdSettings } from "react-icons/md"
import { UserBubble } from "../widgets"
import { UserButton } from "./UserButton"

export function Navbar() {
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
				{Array.from({ length: 10 }).map((_, i) => (
					<UserBubble
						key={i}
						link={`/chat/${i}`}
						data={{
							username: "Jhon Thomson",
						}}
					/>
				))}
			</NavbarUI.Section>
			<NavbarUI.Section>
				<Menu
					position="right"
					control={
						<UserButton
							name="Harriette Spoonlicker"
							email="hspoonlicker@outlook.com"
						/>
					}
				>
					<Menu.Label>Account</Menu.Label>
					<Menu.Item icon={<MdSettings />}>Settings</Menu.Item>

					<Divider />

					<Form method="post">
						<Menu.Item color="red" icon={<BiExit />} type="submit">
							Exit
						</Menu.Item>
					</Form>
				</Menu>
			</NavbarUI.Section>
		</NavbarUI>
	)
}
