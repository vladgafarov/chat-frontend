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
import type { FC } from "react"
import { useEffect, useRef, useState } from "react"
import { MdClose, MdEdit } from "react-icons/md"

const useStyles = createStyles(
	(theme, params: { isAvatar: boolean }, getRef) => ({
		fileWrapper: {
			position: "relative",
			width: "min-content",
			borderRadius: "50%",

			[`&:hover .${getRef("edit")}`]: {
				transform: "translateY(0)",
				opacity: 1,
			},
		},
		avatar: {
			border: `2px solid ${theme.colors.blue[1]}`,
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
}

const SettingsModal: FC<Props> = ({ onClose, open }) => {
	const [file, setFile] = useState<File | null>(null)
	const [fileUrl, setFileUrl] = useState<string | null>(null)
	const resetRef = useRef<() => void>(null)

	const { classes } = useStyles({ isAvatar: !!file })

	function clearFile() {
		setFile(null)
		setFileUrl(null)
		resetRef.current?.()
	}

	useEffect(() => {
		if (!file) {
			return
		}

		const objectUrl = URL.createObjectURL(file)
		setFileUrl(objectUrl)

		return () => URL.revokeObjectURL(objectUrl)
	}, [file])

	return (
		<Modal title="Settings" opened={open} onClose={onClose}>
			<form>
				<div className={classes.fileWrapper}>
					<FileButton
						resetRef={resetRef}
						onChange={setFile}
						accept="image/png,image/jpeg"
					>
						{(props) => (
							<UnstyledButton {...props}>
								<Avatar
									src={fileUrl}
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
					<div className={classes.edit}>
						<MdEdit />
					</div>
				</div>

				<TextInput label="Name" />
				<TextInput label="Email" type="email" />

				{/* <a href="#">Change password</a> */}

				<Button mt="md">Save</Button>
			</form>
		</Modal>
	)
}

export default SettingsModal
