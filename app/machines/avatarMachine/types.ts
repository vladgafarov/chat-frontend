interface AvatarStore {
	url: string
	thumbnailUrl: string
	thumbnail: string // '{"width":2488,"height":2488,"x":397,"y":103}'
}

export type AvatarContext = {
	initial: AvatarStore
	isUploadedImageEdited: boolean
} & Partial<AvatarStore>

export type AvatarEvent =
	| {
			type: "UPLOAD"
			url: string
	  }
	| { type: "DELETE" }
	| { type: "CHANGE_THUMBNAIL" }
	| { type: "CLOSE" }
	| {
			type: "SAVE_THUMBNAIL"
			payload: {
				thumbnailUrl: string
				thumbnail: string
			}
	  }
	| {
			type: "RESET_UPLOAD"
	  }

export type AvatarTypestate =
	| { value: "initial"; context: AvatarContext }
	| {
			value: "uploadingAvatar"
			context: AvatarContext & AvatarStore
	  }
	| {
			value: "deletingAvatar"
			context: AvatarContext & Record<keyof AvatarStore, undefined>
	  }
	| {
			value: "changeThumbnail"
			context: AvatarContext & { thumbnail: string }
	  }
