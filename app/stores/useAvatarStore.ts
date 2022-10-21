import create from "zustand"
import { devtools } from "zustand/middleware"

interface AvatarStore {
	avatarUrl: string
	updateAvatarUrl: (avatarUrl: string) => void
	avatarThumbnailUrl: string
	updateAvatarThumbnailUrl: (avatarThumbnailUrl: string) => void
	avatarThumbnail: string
	updateAvatarThumbnail: (avatarThumbnail: string) => void
}

export const useAvatarStore = create<AvatarStore>()(
	devtools((set) => ({
		avatarUrl: "",
		avatarThumbnailUrl: "",
		avatarThumbnail: "",
		updateAvatarUrl: (avatarUrl) => set({ avatarUrl }),
		updateAvatarThumbnailUrl: (avatarThumbnailUrl) =>
			set({ avatarThumbnailUrl }),
		updateAvatarThumbnail: (avatarThumbnail) => set({ avatarThumbnail }),
	})),
)
