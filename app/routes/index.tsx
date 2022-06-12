import { Switch, useMantineColorScheme } from "@mantine/core"

export default function Index() {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme()
	const dark = colorScheme === "dark"

	return (
		<Switch
			color={dark ? "yellow" : "blue"}
			defaultChecked={dark}
			label="Dark theme"
			onClick={() => toggleColorScheme()}
		/>
	)
}
