import { assign, createMachine } from "xstate"
import type { AvatarContext, AvatarEvent, AvatarTypestate } from "./types"

const avatarMachine =
	/** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgNwBdd0AbAYgFUAFAGQHkBBAEQG0AGALqJQABwD2sSrjH5hIAB6IAjABYAnCQAcSgEwBWADQgAnok06SagGwBmPTbW67dpVYC+bo2ix5CpclS0dFwAoiwhACoh-EJIIOKSVDJyigiqGtr6RqYINgDseVp6ajZWefl8Vnx6KnkeXhg4BMRk+FJBAMIAEhwAcgDiIQD6EV0MALIAQr0cAJIsMXIJUslxqelauoYmiDrqJHk6NnyaKko2Spp5VlZ69SDeTX4kAK4iNGLoEARQHABu6Ao6AATsEwpFooIlhIVrI1mYVFZLFVNI5DqUbDpNNlEJikXkVLVNLdNHwVHxSvdHr4WhAwDQwFR8L8AUDQcx2NxFnFlkk4aBUqcLGcbnklHk9Do1FK8jjcnlNCQrNK8nw+KqHDZNJoqY0aaQcOhmWAItgXqgAEb4dC4eihcJRbmiGF8lKIPQ1LRavRWHR8JTiy7YnYIfRI71nCknTT5NS6nzNA3YI0wU3mq02+gczi8KE8l3SfkKd2emOaH1+gNi7Vyv0qEgqfLqKyXex8HTlDyeED4MR0+BxamJ1rtGjQxKFt0IFQ6OWlRV2LE+2xVWqU7tD55vD5fH7-QEg8ewqdqCVK6tSnRHWxYudXkhHRvK8l6AOVOobvXDukMpksg-AkerrwggZSKnwJTXJKehXKiShzqqRSVMSDgBmoiIqPGTwtIaxpppa1q2kBk4gRUSqnpB-qBlc2w5PofAPkoaq+jcHarphn4Jn4xGrAKiAALRWHKgldm4QA */
	createMachine<AvatarContext, AvatarEvent, AvatarTypestate>(
		{
			id: "avatarMachine",
			initial: "initial",
			context: {
				initial: {
					url: "",
					thumbnailUrl: "",
					thumbnail: "",
				},
				url: "",
				thumbnailUrl: "",
				thumbnail: "",
				isUploadedImageEdited: true,
			},
			states: {
				initial: {
					entry: ["setInitialContext"],
					on: {
						CHANGE_THUMBNAIL: {
							target: "changeThumbnail",
						},
					},
				},
				uploadingAvatar: {
					on: {},
				},
				deletingAvatar: {
					on: {},
				},
				changeThumbnail: {
					on: {},
				},
			},
			on: {
				CLOSE: {
					target: "initial",
				},
				SAVE_THUMBNAIL: {
					actions: ["saveThumbnail"],
				},
				DELETE: {
					target: "deletingAvatar",
					actions: ["deleteAvatar"],
				},
				UPLOAD: {
					target: "uploadingAvatar",
					actions: ["uploadAvatar"],
				},
				RESET_URL: {
					cond: "isUploadedImageEditingCanceled",
					actions: ["resetAfterUploadCancel"],
				},
			},
		},
		{
			actions: {
				setInitialContext: assign({
					url: (context) => context.initial.url,
					thumbnailUrl: (context) => context.initial.thumbnailUrl,
					thumbnail: (context) => context.initial.thumbnail,
				}),
				saveThumbnail: assign((context, event) => {
					if (event.type !== "SAVE_THUMBNAIL") return context

					return {
						initial: {
							...context.initial,
							thumbnail: event.payload.thumbnail,
						},
						thumbnailUrl: event.payload.thumbnailUrl,
						thumbnail: event.payload.thumbnail,
						isUploadedImageEdited: true,
					}
				}),
				deleteAvatar: assign((context) => ({
					url: "",
					thumbnailUrl: "",
					thumbnail: "",
				})),
				uploadAvatar: assign((context, event) => {
					if (event.type !== "UPLOAD") return context

					return {
						url: event.url,
						thumbnail: undefined,
						isUploadedImageEdited: false,
					}
				}),
				resetAfterUploadCancel: assign((context) => ({
					url: context.initial.url,
					thumbnail: context.initial.thumbnail,
					isUploadedImageEdited: true,
				})),
			},
			guards: {
				isUploadedImageEditingCanceled: (context) =>
					!context.isUploadedImageEdited,
			},
		},
	)

export default avatarMachine
