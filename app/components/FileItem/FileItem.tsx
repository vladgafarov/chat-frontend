import { createStyles, Image, Modal, Text } from "@mantine/core"
import type { FC } from "react"
import { useState } from "react"
import { BiZoomIn } from "react-icons/bi"
import { CgClose } from "react-icons/cg"
import { FaRegFile } from "react-icons/fa"

const useStyle = createStyles((theme, params, getRef) => ({
	root: {
		position: "relative",
		padding: theme.spacing.md,
		border: `1px solid ${theme.colors.blue[3]}`,
		borderRadius: theme.radius.md,
		backgroundColor: "white",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		width: "70px",
		height: "100px",
		[`&:hover .${getRef("deleteButton")}`]: {
			opacity: 1,
		},
		[`&:hover .${getRef("zoom")}`]: {
			opacity: 1,
		},
	},
	fileImage: {
		position: "absolute",
		inset: 0,
		borderRadius: theme.radius.md,
		overflow: "hidden",
		img: {
			height: "100%",
			width: "100%",
			objectFit: "contain",
		},
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
	zoom: {
		ref: getRef("zoom"),
		position: "absolute",
		inset: 0,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		cursor: "pointer",
		color: "white",
		fontSize: theme.fontSizes.xl,
		opacity: 0,
		transition: "opacity 0.2s ease-in-out",
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
	const [isImageModalOpen, setIsImageModalOpen] = useState(false)

	const fileExtension = file.name.split(".").pop()

	const imageBlob =
		fileExtension && imageExtensions.includes(fileExtension.toLowerCase())
			? URL.createObjectURL(file)
			: undefined

	return (
		<>
			<div className={classes.root} title={file.name}>
				{imageBlob ? (
					<div className={classes.fileImage}>
						<img src={URL.createObjectURL(file)} alt={file.name} />

						<div
							className={classes.zoom}
							onClick={() => setIsImageModalOpen(true)}
						>
							<BiZoomIn />
						</div>

						<Modal
							opened={isImageModalOpen}
							onClose={() => setIsImageModalOpen(false)}
							title={file.name}
							size="lg"
						>
							<Image
								src={imageBlob}
								alt={file.name}
								height={600}
								fit="contain"
							/>
						</Modal>
					</div>
				) : (
					<>
						<FaRegFile />
						<Text>.{fileExtension}</Text>
					</>
				)}
				<div className={classes.deleteButton} onClick={() => onDelete(id)}>
					<CgClose />
				</div>
			</div>
		</>
	)
}

export default FileItem
