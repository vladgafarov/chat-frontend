import {
	ActionIcon,
	Avatar,
	Button,
	createStyles,
	FileButton,
	Modal,
	Text,
	TextInput,
	UnstyledButton,
} from "@mantine/core"
import { useFetcher } from "@remix-run/react"
import { useInterpret, useSelector } from "@xstate/react"
import type { FC } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { MdClose, MdEdit } from "react-icons/md"
import { avatarMachine } from "~/machines"
import { AvatarState } from "~/machines/avatarMachine/types"
import type { User } from "~/models/user/user.server"
import AvatarEdit from "../AvatarEdit"
import { AvatarContext } from "./context"

const useStyles = createStyles(
	(theme, params: { isAvatar: boolean }, getRef) => ({
		fileWrapper: {
			position: "relative",
			width: "min-content",
			borderRadius: "50%",

			[`&:hover .${getRef("edit")}`]: {
				transform: "translateY(0)",
				opacity: params.isAvatar ? "1" : "0",
			},
		},
		avatar: {
			border: `2px solid ${theme.colors.blue[1]}`,
			borderRadius: "50%",
		},
		clearFile: {
			position: "absolute",
			top: 0,
			right: 0,
			transform: "translate(50%, -50%)",
			"&:focus": {
				transform: "translate(50%, -50%)",
			},
			opacity: params.isAvatar ? "1" : "0",
		},
		edit: {
			ref: getRef("edit"),
			position: "absolute",
			bottom: 0,
			left: 0,
			width: "100%",
			backgroundColor: theme.colors.blue[2],
			transition: "all 0.35s ease-in-out",
			transform: "translateY(80%)",
			color: "white",
			textAlign: "center",
			cursor: "pointer",
			opacity: 0,
			borderRadius: theme.radius.sm,

			"&:hover": {
				backgroundColor: theme.colors.blue[3],
			},
		},
	}),
)

interface Props {
	open: boolean
	onClose: () => void
	user: User
}

const SettingsModal: FC<Props> = ({ onClose, open, user }) => {
	const avatarService = useInterpret(avatarMachine, {
		devTools: true,
		context: {
			initial: {
				url: user.avatarUrl ?? "",
				thumbnailUrl: user.avatarThumbnailUrl ?? "",
				thumbnail: user.avatarThumbnail ?? "",
			},
		},
	})

	const { send } = avatarService
	const avatarUrl = useSelector(avatarService, (state) => state.context.url)
	const avatarThumbnailUrl = useSelector(
		avatarService,
		(state) => state.context.thumbnailUrl,
	)
	const avatarThumbnail = useSelector(
		avatarService,
		(state) => state.context.thumbnail,
	)

	const [isAvatarEditOpen, setIsAvatarEditOpen] = useState(false)

	const fetcher = useFetcher()

	const [name, setName] = useState(user.name)
	const [email, setEmail] = useState(user.email)

	const [file, setFile] = useState<File | null>(null)
	const resetRef = useRef<() => void>(null)

	const { classes } = useStyles({
		isAvatar: !!avatarThumbnailUrl,
	})

	function clearFile() {
		setFile(null)
		send({ type: "DELETE" })

		resetRef.current?.()
	}

	function onSubmit() {
		// send({ type: "CLOSE" })
	}

	const isDirty = useMemo(
		() =>
			name !== user.name ||
			email !== user.email ||
			!!file ||
			avatarThumbnail !== user.avatarThumbnail!,

		// eslint-disable-next-line react-hooks/exhaustive-deps
		[avatarThumbnail, email, file, name],
	)

	const currentState = useMemo(
		() => avatarService.getSnapshot().value,
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[avatarService.getSnapshot().value],
	) as AvatarState

	useEffect(() => {
		if (!file) {
			return
		}

		const objectUrl = URL.createObjectURL(file)
		send({ type: "UPLOAD", url: objectUrl })
		setIsAvatarEditOpen(true)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [file])

	useEffect(() => {
		if (!open) {
			setName(user.name)
			setEmail(user.email)
			setFile(null)
			send({ type: "CLOSE" })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open])

	useEffect(() => {
		if (fetcher.data && !fetcher.data.error) {
			send({ type: "UPDATE_INITIAL", payload: fetcher.data })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetcher.data])

	return (
		<AvatarContext.Provider value={{ avatarService }}>
			<Modal title="Settings" opened={open} onClose={onClose}>
				<fetcher.Form
					method="post"
					action="/resources/updateProfile"
					encType="multipart/form-data"
					onSubmit={onSubmit}
				>
					<div className={classes.fileWrapper}>
						<FileButton
							resetRef={resetRef}
							onChange={setFile}
							accept="image/*"
							name="avatar"
						>
							{(props) => (
								<UnstyledButton {...props}>
									<Avatar
										src={avatarThumbnailUrl}
										size="xl"
										radius={"xl"}
										className={classes.avatar}
									/>
								</UnstyledButton>
							)}
						</FileButton>
						<ActionIcon
							color="red"
							radius={"xl"}
							className={classes.clearFile}
							onClick={clearFile}
						>
							<MdClose />
						</ActionIcon>
						<div
							className={classes.edit}
							onClick={() => setIsAvatarEditOpen(true)}
						>
							<MdEdit />
						</div>
					</div>

					<TextInput
						name="name"
						label="Name"
						value={name}
						onChange={(e) => setName(e.currentTarget.value)}
					/>
					<TextInput
						name="email"
						label="Email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.currentTarget.value)}
					/>

					{currentState !== AvatarState.initial && (
						<input
							type="hidden"
							name="avatarThumbnail"
							defaultValue={avatarThumbnail}
						/>
					)}

					{currentState === AvatarState.changeThumbnail && (
						<input
							type="hidden"
							name="avatarUrl"
							defaultValue={avatarUrl}
						/>
					)}

					{currentState === AvatarState.deletingAvatar && (
						<>
							<input type="hidden" name="avatarUrl" defaultValue={""} />
							<input
								type="hidden"
								name="avatarThumbnailUrl"
								defaultValue={""}
							/>
						</>
					)}

					{fetcher.data && <Text color="red">{fetcher.data.error} </Text>}

					<Button
						mt="md"
						type="submit"
						loading={fetcher.state === "submitting"}
						disabled={!isDirty}
					>
						Save
					</Button>
				</fetcher.Form>
			</Modal>
			<AvatarEdit
				open={isAvatarEditOpen}
				onClose={() => {
					send({ type: "RESET_UPLOAD" })
					setIsAvatarEditOpen(false)
				}}
			/>
		</AvatarContext.Provider>
	)
}

export default SettingsModal
