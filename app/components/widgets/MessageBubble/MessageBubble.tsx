import { Box, Text } from "@mantine/core"

interface Props {
	children: React.ReactNode
	direction: "left" | "right"
	data: {
		message: string
		time: string
	}
}

export const MessageBubble = ({ children, direction, data }: Props) => {
	direction = Math.floor(Math.random() * 2) === 0 ? "left" : "right"

	return (
		<Box
			sx={(theme) => ({
				display: "flex",
				justifyContent: direction,
			})}
		>
			<Box
				sx={(theme) => ({
					backgroundColor:
						direction === "left"
							? theme.colors.blue[1]
							: theme.colors.blue[3],
					borderRadius: theme.radius.md,
					padding: theme.spacing.md,
				})}
			>
				{children}
				<Text align={direction} size="xs" color={"gray"}>
					12:38
				</Text>
			</Box>
		</Box>
	)
}
