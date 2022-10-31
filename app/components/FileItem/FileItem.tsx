import { createStyles, Text } from "@mantine/core"
import type { FC } from "react"
import { CgClose } from "react-icons/cg"
import { FaRegFile, FaRegFileImage } from "react-icons/fa"

const useStyle = createStyles((theme, params, getRef) => ({
	root: {
		position: "relative",
		padding: theme.spacing.md,
		border: `1px solid ${theme.colors.blue[3]}`,
		borderRadius: theme.radius.md,
		backgroundColor: "white",
		display: "flex",
		alignItems: "center",
		flexDirection: "column",
		justifyContent: "center",
		width: "70px",
		[`&:hover .${getRef("deleteButton")}`]: {
			opacity: 1,
		},
	},
	fileImage: {
		fontSize: theme.fontSizes.xl,
	},
	deleteButton: {
		ref: getRef("deleteButton"),
		opacity: 0,
		transition: "opacity 0.2s ease-in-out",
		position: "absolute",
		top: 0,
		right: 0,
		transform: "translate(50%, -50%)",
		backgroundColor: "white",
		borderRadius: "50%",
		border: `1px solid ${theme.colors.red[3]}`,
		cursor: "pointer",
		color: theme.colors.red[5],
		width: "18px",
		height: "18px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",

		"&:hover": {
			color: theme.colors.red[6],
		},
	},
}))

const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"]
interface Props {
	id: string
	file: File
	onDelete: (id: string) => void
}

const FileItem: FC<Props> = ({ id, file, onDelete }) => {
	const { classes } = useStyle()

	const fileExtension = file.name.split(".").pop()

	return (
		<div className={classes.root} title={file.name}>
			<div className={classes.fileImage}>
				{fileExtension &&
				imageExtensions.includes(fileExtension.toLowerCase()) ? (
					<FaRegFileImage />
				) : (
					<FaRegFile />
				)}
			</div>
			<Text>.{fileExtension}</Text>
			<div className={classes.deleteButton} onClick={() => onDelete(id)}>
				<CgClose />
			</div>
		</div>
	)
}

export default FileItem
