import {
	Avatar,
	Divider,
	Group,
	Menu,
	Navbar as NavbarUI,
	ScrollArea,
	Title,
	UnstyledButton,
} from "@mantine/core"
import { Link } from "@remix-run/react"
import { BiExit } from "react-icons/bi"
import { MdSettings } from "react-icons/md"
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
					<UnstyledButton
						key={i}
						mb="md"
						component={Link}
						to={`/chat/${i}`}
						sx={(theme) => ({
							width: "100%",
							border: `2px solid ${theme.colors.gray[1]}`,
							borderRadius: theme.radius.md,
							display: "block",
						})}
					>
						<Group>
							<Avatar src={undefined} radius="xl" />
							<Title order={6}>Jhon Thomson</Title>
						</Group>
					</UnstyledButton>
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

					<Menu.Item color="red" icon={<BiExit />}>
						Exit
					</Menu.Item>
				</Menu>
			</NavbarUI.Section>
		</NavbarUI>
	)
}
