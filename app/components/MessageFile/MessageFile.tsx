import { createStyles, Image, Modal, Text } from "@mantine/core"
import type { FC } from "react"
import { useState } from "react"
import { BiZoomIn } from "react-icons/bi"
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
	name: string
	url: string
	mimetype: string
	size: number
}

const MessageFile: FC<Props> = ({ mimetype, url, name, size }) => {
	const { classes } = useStyle()
	const [isImageModalOpen, setIsImageModalOpen] = useState(false)

	const fileExtension = name.split(".").pop()

	const isImage = fileExtension && imageExtensions.includes(fileExtension)

	if (isImage) {
		return (
			<div className={classes.root} title={name}>
				<div className={classes.fileImage}>
					<img src={url} alt={name} />

					<div
						className={classes.zoom}
						onClick={() => setIsImageModalOpen(true)}
					>
						<BiZoomIn />
					</div>

					<Modal
						opened={isImageModalOpen}
						onClose={() => setIsImageModalOpen(false)}
						title={name}
						size="lg"
					>
						<Image src={url} alt={name} height={600} fit="contain" />
					</Modal>
				</div>
			</div>
		)
	}

	return (
		<a href={url} target="_blank" rel="noreferrer">
			<div className={classes.root} title={name}>
				<FaRegFile />
				<Text>.{fileExtension}</Text>
			</div>
		</a>
	)
}

export default MessageFile
