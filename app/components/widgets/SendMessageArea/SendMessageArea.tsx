import { Box, Button, TextInput } from "@mantine/core"
import { BiSend } from "react-icons/bi"

const SendMessageButton = () => {
	return (
		<Button variant="subtle" px="xs" radius={"xs"}>
			<BiSend />
		</Button>
	)
}

export const SendMessageArea = () => {
	return (
		<Box
			sx={(theme) => ({
				backgroundColor: theme.colors.blue[1],
				position: "sticky",
				bottom: "0",
				width: "100%",
				marginInlineStart: "50%",
				transform: "translateX(-50%)",
				zIndex: 1,
			})}
			p="sm"
		>
			<TextInput
				placeholder="Enter a message"
				rightSection={<SendMessageButton />}
			/>
		</Box>
	)
}
