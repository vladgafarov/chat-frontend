import type { User } from "~/models/user/user.server"

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
	| {
			type: "UPDATE_INITIAL"
			payload: Pick<
				User,
				"avatarThumbnail" | "avatarThumbnailUrl" | "avatarUrl"
			>
	  }

export enum AvatarState {
	initial = "initial",
	uploadingAvatar = "uploadingAvatar",
	deletingAvatar = "deletingAvatar",
	changeThumbnail = "changeThumbnail",
}

export type AvatarTypestate =
	| { value: AvatarState.initial; context: AvatarContext }
	| {
			value: AvatarState.uploadingAvatar
			context: AvatarContext & AvatarStore
	  }
	| {
			value: AvatarState.deletingAvatar
			context: AvatarContext & Record<keyof AvatarStore, undefined>
	  }
	| {
			value: AvatarState.changeThumbnail
			context: AvatarContext & { thumbnail: string }
	  }
