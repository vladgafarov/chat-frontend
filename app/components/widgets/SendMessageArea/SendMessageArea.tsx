import { Box } from "@mantine/core"

const SendMessageArea = () => {
	return (
		<Box
			sx={(theme) => ({
				backgroundColor: "white",
				position: "sticky",
				bottom: "0",
				width: "100%",
				marginInlineStart: "50%",
				transform: "translateX(-50%)",
			})}
		>
			SendMessageArea
		</Box>
	)
}

export default SendMessageArea
