import { Title } from "@mantine/core"
import type { FC, ReactNode } from "react"

const MessageTitle: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<Title order={6} weight={500}>
			{children}
		</Title>
	)
}

export default MessageTitle
