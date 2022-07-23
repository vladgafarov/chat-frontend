import {
	Box,
	Button,
	Divider,
	PasswordInput,
	Text,
	TextInput,
	Title,
} from "@mantine/core"
import type { ActionFunction, LoaderArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { json } from "@remix-run/node"
import {
	Form,
	Link,
	useActionData,
	useLoaderData,
	useLocation,
	useNavigate,
	useTransition,
} from "@remix-run/react"
import { motion } from "framer-motion"
import { BiLockAlt, BiUser } from "react-icons/bi"
import { BsArrowLeft } from "react-icons/bs"
import { MdAlternateEmail } from "react-icons/md"
import type { ZodFormattedError } from "zod"
import { arrowStyles } from "~/components/welcome"
import { commitSession, getSession } from "~/models/auth/session.server"
import type { SignupType } from "~/models/auth/signup.server"
import { signup, SignupSchema } from "~/models/auth/signup.server"

export const loader = async ({ request }: LoaderArgs) => {
	const session = await getSession(request.headers.get("Cookie"))

	const message = session.get("error") || null

	return json(
		{ message: message as string | null },
		{
			headers: {
				"Set-Cookie": await commitSession(session),
			},
		},
	)
}

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData()
	const data = Object.fromEntries(formData) as SignupType

	const schema = SignupSchema.refine(
		(data) => data.password === data.repeatPassword,
		{
			message: "Passwords don't match",
			path: ["repeatPassword"],
		},
	).safeParse(data)

	if (!schema.success) {
		const errors = schema.error.format()
		return json({
			errors,
			values: data,
		})
	}

	const session = await getSession(request.headers.get("Cookie"))

	try {
		const user = await signup({
			email: data.email,
			name: data.name,
			password: data.password,
		})

		session.flash("signup-success", `Welcome, ${user.name}. Please login.`)

		return redirect("/welcome/login", {
			headers: {
				"Set-Cookie": await commitSession(session),
			},
		})
	} catch (error: any) {
		session.flash("error", error.message)

		return json(
			{
				values: data,
			},
			{
				headers: {
					"Set-Cookie": await commitSession(session),
				},
			},
		)
	}
}

export default function Signup() {
	const navigate = useNavigate()
	const location = useLocation()

	const actionData = useActionData<{
		errors: ZodFormattedError<SignupType, string>
		values: SignupType
	}>()

	const transition = useTransition()

	const { message } = useLoaderData<typeof loader>()

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
				<Title order={2}>Sign Up</Title>
			</Box>

			<Box mt="sm">
				<Form method="post">
					{message && <Text color="red">{message}</Text>}

					<TextInput
						name="name"
						label="Name:"
						type="text"
						icon={<BiUser />}
						error={actionData?.errors?.name?._errors.join("\n")}
						defaultValue={actionData?.values?.name}
						required
					/>
					<TextInput
						name="email"
						label="Email:"
						type="email"
						icon={<MdAlternateEmail />}
						error={actionData?.errors?.email?._errors.join("\n")}
						defaultValue={actionData?.values?.email}
						required
						mt="xs"
					/>
					<PasswordInput
						name="password"
						label="Password:"
						mt="xs"
						icon={<BiLockAlt />}
						error={actionData?.errors?.password?._errors.join("\n")}
						defaultValue={actionData?.values?.password}
						required
					/>
					<PasswordInput
						name="repeatPassword"
						label="Repeat password:"
						mt="xs"
						icon={<BiLockAlt />}
						error={actionData?.errors?.repeatPassword?._errors.join(
							" - ",
						)}
						defaultValue={actionData?.values?.repeatPassword}
						required
					/>

					<Divider
						my="sm"
						label="or log in"
						labelProps={{
							component: Link,
							to: "../login",
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
							loading={transition.state === "submitting"}
						>
							Submit
						</Button>
					</Box>
				</Form>
			</Box>
		</Box>
	)
}
