import {
	ActionIcon,
	Avatar,
	Button,
	createStyles,
	FileButton,
	Modal,
	TextInput,
	UnstyledButton,
} from "@mantine/core"
import { useFetcher } from "@remix-run/react"
import type { FC } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { MdClose, MdEdit } from "react-icons/md"
import type { User } from "~/models/user/user.server"
import { useAvatarStore } from "~/stores"

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
	openAvatarEdit: () => void
}

const SettingsModal: FC<Props> = ({ onClose, open, user, openAvatarEdit }) => {
	const avatarThumbnailUrl = useAvatarStore(
		(state) => state.avatarThumbnailUrl,
	)
	const updateAvatarUrl = useAvatarStore((state) => state.updateAvatarUrl)
	const updateAvatarThumbnailUrl = useAvatarStore(
		(state) => state.updateAvatarThumbnailUrl,
	)

	const fetcher = useFetcher()

	const [name, setName] = useState(user.name)
	const [email, setEmail] = useState(user.email)

	const [file, setFile] = useState<File | null>(null)
	const [fileUrl, setFileUrl] = useState<string | null>(user.avatarUrl)
	const resetRef = useRef<() => void>(null)

	const { classes } = useStyles({ isAvatar: !!file || !!avatarThumbnailUrl })

	function clearFile() {
		setFile(null)
		setFileUrl(null)
		updateAvatarUrl("")
		updateAvatarThumbnailUrl("")

		resetRef.current?.()
	}

	const isDirty = useMemo(
		() =>
			name !== user.name ||
			email !== user.email ||
			!!file ||
			!!fileUrl !== !!user.avatarUrl,
		[name, email, file, fileUrl, user],
	)

	useEffect(() => {
		if (!file) {
			return
		}

		const objectUrl = URL.createObjectURL(file)

		setFileUrl(objectUrl)
		updateAvatarUrl(objectUrl)
		openAvatarEdit()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [file])

	useEffect(() => {
		if (!open) {
			setName(user.name)
			setEmail(user.email)
			setFile(null)
			setFileUrl(user.avatarUrl)
		}
	}, [open, user.avatarUrl, user.email, user.name])

	// useEffect(() => {

	// }, [])

	return (
		<Modal title="Settings" opened={open} onClose={onClose}>
			<fetcher.Form
				method="post"
				action="/resources/updateProfile"
				encType="multipart/form-data"
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
									src={avatarThumbnailUrl ?? fileUrl}
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
					<div className={classes.edit} onClick={openAvatarEdit}>
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

				<input
					type="hidden"
					name="avatarUrl"
					defaultValue={fileUrl ?? ""}
				/>
				{/* <input /> */}

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
	)
}

export default SettingsModal
