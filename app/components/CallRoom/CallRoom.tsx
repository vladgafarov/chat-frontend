import { ActionIcon, Avatar, createStyles, Grid } from "@mantine/core"
import type { FC } from "react"
import { FiPhone } from "react-icons/fi"

const usersDefault = [
	{
		id: 1,
		name: "John Doe",
		avatarUrl: null,
	},
	{
		id: 2,
		name: "BOB",
		avatarUrl: null,
	},
	{
		id: 3,
		name: "g",
		avatarUrl: null,
	},
	{
		id: 4,
		name: "k",
		avatarUrl: null,
	},
	{
		id: 5,
		name: "k",
		avatarUrl: null,
	},
]

const useStyles = createStyles((theme) => ({
	item: {
		borderRadius: theme.radius.sm,
		border: `1px solid ${theme.colors.blue[3]}`,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		padding: theme.spacing.xl,
	},
	controls: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		position: "fixed",
		bottom: "20px",
		width: "50%",
		transform: "translateX(-50%)",
		left: "50%",
	},
}))

interface Props {
	users?: {
		id: number
		name: string
		avatarUrl: string
	}[]
}

const CallRoom: FC<Props> = ({ users = usersDefault }) => {
	const { classes } = useStyles()

	return (
		<>
			<Grid columns={3} justify="center" mt="xl">
				{users.slice(0, 4).map((user) => (
					<Grid.Col key={user.id} span={1} className={classes.item}>
						<Avatar size="xl" radius={100} src={user?.avatarUrl || null}>
							{user.name[0]}
						</Avatar>
					</Grid.Col>
				))}
			</Grid>
			<div className={classes.controls}>
				<ActionIcon color="red" size="xl" variant="filled">
					<FiPhone />
				</ActionIcon>
			</div>
		</>
	)
}

export default CallRoom
