import {
	Anchor,
	Box,
	Button,
	Divider,
	PasswordInput,
	Text,
	TextInput,
	Title,
} from "@mantine/core"
import type { ActionFunction, LoaderArgs, MetaFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import {
	Link,
	useFetcher,
	useLoaderData,
	useLocation,
	useNavigate,
} from "@remix-run/react"
import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
import { BiLockAlt } from "react-icons/bi"
import { BsArrowLeft } from "react-icons/bs"
import { MdAlternateEmail } from "react-icons/md"
import type { ZodFormattedError } from "zod"
import { arrowStyles } from "~/components/welcome"
import type { LoginType } from "~/models/auth/login.server"
import { login, LoginSchema } from "~/models/auth/login.server"
import { commitSession, getUserSession } from "~/models/auth/session.server"

export const meta: MetaFunction = () => ({
	title: "Login",
})

export const loader = async ({ request }: LoaderArgs) => {
	const session = await getUserSession(request)

	const errorMessage = session.get("error") || null
	const signupMessage = session.get("signup-success") || null

	return json(
		{
			errorMessage: errorMessage as string | null,
			signupMessage: signupMessage as string | null,
		},
		{
			headers: {
				"Set-Cookie": await commitSession(session),
			},
		},
	)
}

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData()
	const data = Object.fromEntries(formData) as LoginType

	const schema = LoginSchema.safeParse(data)

	if (!schema.success) {
		const errors = schema.error.format()
		return json({
			errors,
		})
	}

	const session = await getUserSession(request)

	try {
		const tokens = await login(data)
		session.set("access_token", tokens.access_token)
		session.set("refresh_token", tokens.refresh_token)

		session.flash("success", "Login successful")

		return redirect("/", {
			headers: {
				"Set-Cookie": await commitSession(session),
			},
		})
	} catch (error: any) {
		session.flash("error", error.message)
		return json(
			{ values: data },
			{
				headers: {
					"Set-Cookie": await commitSession(session),
				},
			},
		)
	}
}

interface LoginFormControlsCollection extends HTMLFormControlsCollection {
	email?: HTMLInputElement
	password?: HTMLInputElement
}
interface LoginFormElement extends HTMLFormElement {
	readonly elements: LoginFormControlsCollection
}

export default function Login() {
	const navigate = useNavigate()
	const location = useLocation()
	const formRef = useRef<LoginFormElement>(null)

	const { signupMessage, errorMessage } = useLoaderData<typeof loader>()

	const fetcher = useFetcher<{
		errors: ZodFormattedError<LoginType, string>
	}>()

	const errors = fetcher.data?.errors

	useEffect(() => {
		if (errors?.email) {
			formRef.current?.elements.email?.focus()
		} else if (errors?.password) {
			formRef.current?.elements.password?.focus()
		}
	}, [errors?.email, errors?.password])

	return (
		<Box
			key={location.key}
			component={motion.div}
			initial={{ y: 10, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			exit={{ y: -10, opacity: 0 }}
			transition={{ delay: 0.2, ease: "easeOut" }}
		>
			<Box
				sx={() => ({
					position: "relative",
					textAlign: "center",
				})}
			>
				<Box sx={arrowStyles} onClick={() => navigate("../")}>
					<BsArrowLeft size={23} />
				</Box>
				<Title order={2}>Log In</Title>
			</Box>

			<Box mt="sm">
				<fetcher.Form method="post" ref={formRef}>
					{errorMessage && <Text color="red">{errorMessage}</Text>}
					{signupMessage && <Text>{signupMessage}</Text>}

					<TextInput
						name="email"
						label="Email:"
						type="email"
						icon={<MdAlternateEmail />}
						error={errors?.email?._errors.join("\n")}
						required
					/>
					<PasswordInput
						name="password"
						label="Password:"
						mt="xs"
						icon={<BiLockAlt />}
						error={errors?.password?._errors.join("\n")}
						required
					/>

					<Anchor component={Link} to="/reset" size="xs">
						Forgot password?
					</Anchor>

					<Divider
						my="sm"
						label="or sign up"
						labelProps={{
							component: Link,
							to: "../signup",
						}}
						labelPosition="center"
						color="blue"
					/>

					<Box
						sx={() => ({
							display: "flex",
							justifyContent: "center",
						})}
					>
						<Button
							mt="sm"
							type="submit"
							loading={fetcher.state === "submitting"}
						>
							Submit
						</Button>
					</Box>
				</fetcher.Form>
			</Box>
		</Box>
	)
}
