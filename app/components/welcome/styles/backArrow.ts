import type { CSSObject } from "@mantine/core"

export const arrowStyles: CSSObject = {
	position: "absolute",
	top: "50%",
	left: "0",
	transform: "translateY(-50%)",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	cursor: "pointer",
	transition: ".3s",
	"&:hover": {
		transform: "translateY(-50%) scale(1.15)",
	},
}
