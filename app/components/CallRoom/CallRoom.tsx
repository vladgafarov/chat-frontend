import {
	ActionIcon,
	Avatar,
	Center,
	createStyles,
	Grid,
	Modal,
} from "@mantine/core"
import { useOutletContext, useParams } from "@remix-run/react"
import type { FC } from "react"
import { useEffect, useRef, useState } from "react"
import { FiPhone } from "react-icons/fi"
import Peer from "simple-peer"
import type { User } from "~/models/user/user.server"
import type { IChatContext } from "~/types/ChatContext"

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

const peers: {
	peer: Peer.Instance
	id: number
}[] = []

type CallUser = Pick<User, "id" | "name" | "avatarThumbnailUrl">

interface Props {
	isOpen: boolean
	onClose: () => void
}

const CallRoom: FC<Props> = ({ isOpen, onClose }) => {
	const { classes } = useStyles()
	const audioRef = useRef<HTMLVideoElement>(null)

	const { user, socket } = useOutletContext<IChatContext>()
	const { chatId } = useParams()

	const [users, setUsers] = useState<CallUser[]>([])

	useEffect(() => {
		if (typeof window !== "undefined") {
			navigator.mediaDevices
				.getUserMedia({ audio: true })
				.then((stream) => {
					socket.emit("CLIENT@ROOM:CALL:JOIN", {
						roomId: +(chatId as string),
						userId: user.id,
					})

					socket.on("SERVER@ROOM:CALL:JOIN", (allUsers: CallUser[]) => {
						setUsers(allUsers)

						allUsers.forEach((speaker) => {
							if (
								speaker.id !== user.id &&
								!peers.find((obj) => obj.id !== speaker.id)
							) {
								const peerIncome = new Peer({
									initiator: true,
									trickle: false,
									stream,
								})

								peerIncome.on("signal", (signal) => {
									console.log(
										"1. СИГНАЛ СОЗДАН. ПРОСИМ ЮЗЕРА " +
											speaker.id +
											" НАМ ПОЗВОНИТЬ",
									)

									socket.emit("CLIENT@ROOM:CALL", {
										roomId: +(chatId as string),
										targetUserId: speaker.id,
										callerUserId: user.id,
										signal,
									})

									peers.push({
										peer: peerIncome,
										id: speaker.id,
									})
								})

								socket.on(
									"SERVER@ROOM:CALL",
									({
										targetUserId,
										callerUserId,
										signal: callerSignal,
									}) => {
										console.log(
											"2. ЮЗЕР " +
												callerUserId +
												" ПОДКЛЮЧИЛСЯ, ЗВОНИМ!",
										)

										const peerOutcome = new Peer({
											initiator: false,
											trickle: false,
											stream,
										})

										peerOutcome.signal(callerSignal)

										peerOutcome
											.on("signal", (outSignal) => {
												console.log(
													"3. ПОЛУЧИЛИ СИГНАЛ НАШ, ОТПРАВЛЯЕМ В ОТВЕТ ЮЗЕРУ " +
														callerUserId,
												)

												socket.emit("CLIENT@ROOM:CALL:ANSWER", {
													roomId: +(chatId as string),
													targetUserId: callerUserId,
													callerUserId: targetUserId,
													// targetUserId,
													// callerUserId,
													signal: outSignal,
												})
											})
											.on("stream", (stream) => {
												if (audioRef.current) {
													audioRef.current.srcObject = stream
												}
											})
									},
								)

								socket.on(
									"SERVER@ROOM:CALL:ANSWER",
									({ callerUserId, signal }) => {
										const obj = peers.find(
											(obj) =>
												Number(obj.id) === Number(callerUserId),
										)
										if (obj) {
											obj.peer.signal(signal)
										}
										console.log("4. МЫ ОТВЕТИЛИ ЮЗЕРУ", callerUserId)
									},
								)
							}
						})
					})

					socket.on("SERVER@ROOM:CALL:LEAVE", (users: CallUser[]) => {
						setUsers(users)
					})
				})
				.catch(() => {
					console.error("No video/audio permissions")
				})
		}

		return () => {
			if (audioRef.current) {
				audioRef.current.srcObject = null
			}
			socket.off("SERVER@ROOM:CALL:JOIN")
			socket.off("SERVER@ROOM:CALL:LEAVE")

			socket.emit("CLIENT@ROOM:CALL:LEAVE", {
				userId: user.id,
				roomId: +(chatId as string),
			})

			peers.forEach((obj) => {
				obj.peer.destroy()
			})
		}
	}, [])

	return (
		<Modal opened={isOpen} onClose={onClose} size="xl">
			<audio ref={audioRef} autoPlay />
			{/* <video ref={audioRef} autoPlay /> */}

			<Grid columns={3} justify="center">
				{users.map((user) => (
					<Grid.Col key={user.id} span={1} className={classes.item}>
						<Avatar
							size="xl"
							radius={100}
							src={user?.avatarThumbnailUrl || null}
						>
							{user.name[0]}
						</Avatar>
					</Grid.Col>
				))}
			</Grid>
			<Center mt="xl">
				<ActionIcon color="red" size="xl" variant="filled">
					<FiPhone />
				</ActionIcon>
			</Center>
		</Modal>
	)
}

export default CallRoom
