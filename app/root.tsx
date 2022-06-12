import type { ColorScheme } from "@mantine/core"
import { MantineProvider, ColorSchemeProvider } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import type { MetaFunction } from "@remix-run/node"
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react"
import { useState } from "react"

export const meta: MetaFunction = () => ({
	charset: "utf-8",
	title: "New Remix App",
	viewport: "width=device-width,initial-scale=1",
})

export default function App() {
	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<MantineTheme>
					<Outlet />
				</MantineTheme>

				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}

function MantineTheme({ children }: { children: React.ReactNode }) {
	const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
		key: "mantine-color-scheme",
		defaultValue: "light",
		getInitialValueInEffect: true,
	})

	const toggleColorScheme = (value?: ColorScheme) =>
		setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"))

	return (
		<ColorSchemeProvider
			colorScheme={colorScheme}
			toggleColorScheme={toggleColorScheme}
		>
			<MantineProvider
				theme={{ colorScheme }}
				defaultProps={{
					Button: { radius: "lg" },
				}}
				withNormalizeCSS
				withGlobalStyles
			>
				{children}
			</MantineProvider>
		</ColorSchemeProvider>
	)
}
