import create from "zustand"

interface AvatarStore {
	avatarUrl: string
	updateAvatarUrl: (avatarUrl: string) => void
	avatarThumbnailUrl: string
	updateAvatarThumbnailUrl: (avatarThumbnailUrl: string) => void
	avatarThumbnail: string
	updateAvatarThumbnail: (avatarThumbnail: string) => void
}

export const useAvatarStore = create<AvatarStore>((set) => ({
	avatarUrl: "",
	avatarThumbnailUrl: "",
	avatarThumbnail: "",
	updateAvatarUrl: (avatarUrl) => set({ avatarUrl }),
	updateAvatarThumbnailUrl: (avatarThumbnailUrl) =>
		set({ avatarThumbnailUrl }),
	updateAvatarThumbnail: (avatarThumbnail) => set({ avatarThumbnail }),
}))
