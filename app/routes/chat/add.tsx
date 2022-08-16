import { ActionIcon, Avatar, Group, Modal, Stack, Text } from "@mantine/core"
import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData, useNavigate } from "@remix-run/react"
import { BiPlus } from "react-icons/bi"

export const loader = async ({ request }: LoaderArgs) => {
	const users = [
		{
			id: 1,
			name: "Jhon Thomson",
		},
		{
			id: 2,
			name: "Thomas Doe",
		},
		{
			id: 3,
			name: "Nicola Merkel",
		},
	]

	return json({ users })
}

export const action = async ({ request }: ActionArgs) => {}

export default function Add() {
	const loaderData = useLoaderData<typeof loader>()

	const navigate = useNavigate()

	const onClose = () => {
		navigate("/chat")
	}

	return (
		<Modal opened={true} onClose={onClose} title="Add chat">
			<Text>Online users</Text>

			<Stack
				spacing={"xs"}
				sx={(theme) => ({
					marginTop: theme.spacing.xs,
				})}
			>
				{loaderData.users.map(({ id, name }) => (
					<Group key={id}>
						<Avatar radius={"xl"} color="orange">
							{name[0]}
						</Avatar>
						<Text>{name}</Text>
						<ActionIcon
							sx={() => ({
								marginLeft: "auto",
							})}
							title="Create chat"
						>
							<BiPlus />
						</ActionIcon>
					</Group>
				))}
			</Stack>
		</Modal>
	)
}
