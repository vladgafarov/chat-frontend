import { Box, Button, Group } from "@mantine/core"

export default function Main() {
	return (
		<Group
			sx={(theme) => ({
				backgroundImage: "url(/auth.png)",
				backgroundSize: "cover",
				height: "100vh",
			})}
			align="center"
			position="center"
		>
			<Box
				sx={(theme) => ({
					position: "relative",
					width: "320px",
					borderRadius: theme.radius.lg,
					backgroundColor: theme.fn.rgba("#fff", 0.3),
					backdropFilter: "blur(10px)",
				})}
				p="xl"
			>
				<Group grow direction="column" align="center">
					<img src="/logo.svg" alt="Super Chat Logo" width="128px" />
					<Button>Log In</Button>
					<Button>Sing Up</Button>
				</Group>
			</Box>
		</Group>
	)
}
