import { Button, createStyles, Group, Modal, Slider } from "@mantine/core"
import { useSelector } from "@xstate/react"
import type { FC } from "react"
import { useCallback, useContext, useState } from "react"
import Cropper from "react-easy-crop"
import getCroppedImg from "~/utils/cropImage"
import { AvatarContext } from "../SettingsModal/context"

const useStyles = createStyles((theme) => ({
	cropper: {
		position: "relative",
		height: "460px",
	},
}))

interface Props {
	open: boolean
	onClose: () => void
}

const AvatarEdit: FC<Props> = ({ onClose, open }) => {
	const { classes } = useStyles()

	const { avatarService } = useContext(AvatarContext)
	const { send } = avatarService

	const avatarUrl = useSelector(avatarService, (state) => state.context.url)
	const avatarThumbnail = useSelector(
		avatarService,
		(state) => state.context.thumbnail,
	)

	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
	//@ts-ignore
	const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
		setCroppedAreaPixels(croppedAreaPixels)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	async function onComplete() {
		const croppedImageBlob = await getCroppedImg(
			avatarUrl,
			croppedAreaPixels,
			0,
		)

		send({
			type: "SAVE_THUMBNAIL",
			payload: {
				thumbnail: JSON.stringify(croppedAreaPixels),
				thumbnailUrl: croppedImageBlob,
			},
		})
		send({ type: "CHANGE_THUMBNAIL" })

		onClose()
	}

	return (
		<Modal
			opened={open}
			onClose={onClose}
			title="Edit Avatar"
			size="xl"
			closeOnClickOutside={false}
			closeOnEscape={false}
			withCloseButton={false}
		>
			<div className={classes.cropper}>
				<Cropper
					image={avatarUrl}
					crop={crop}
					zoom={zoom}
					aspect={1}
					cropShape="round"
					showGrid={false}
					onCropChange={setCrop}
					onCropComplete={onCropComplete}
					onZoomChange={setZoom}
					initialCroppedAreaPixels={
						avatarThumbnail && JSON.parse(avatarThumbnail)
					}
				/>
			</div>

			<Slider
				value={zoom}
				onChange={setZoom}
				min={1}
				max={3}
				step={0.1}
				label={null}
				mt="lg"
			/>

			<Group mt="lg">
				<Button onClick={onComplete}>Continue</Button>
				<Button variant="outline" onClick={onClose}>
					Cancel
				</Button>
			</Group>
		</Modal>
	)
}

export default AvatarEdit
