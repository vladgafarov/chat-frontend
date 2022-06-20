import {
	Anchor,
	Box,
	Button,
	Divider,
	PasswordInput,
	TextInput,
	Title,
} from "@mantine/core"
import type { ActionFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { json } from "@remix-run/node"
import {
	Form,
	Link,
	useActionData,
	useLocation,
	useNavigate,
	useTransition,
} from "@remix-run/react"
import { motion } from "framer-motion"
import { BiLockAlt } from "react-icons/bi"
import { BsArrowLeft } from "react-icons/bs"
import { MdAlternateEmail } from "react-icons/md"
import type { ZodFormattedError } from "zod"
import { arrowStyles } from "~/components/welcome"
import type { LoginType } from "~/models/auth/login.server"
import { LoginSchema } from "~/models/auth/login.server"

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData()
	const data = Object.fromEntries(formData)

	const schema = LoginSchema.safeParse(data)

	if (!schema.success) {
		const errors = schema.error.format()
		return json({
			errors,
			values: data,
		})
	}

	return redirect("../")
}

export default function Login() {
	const navigate = useNavigate()
	const location = useLocation()
	const transition = useTransition()

	const actionData = useActionData<{
		errors: ZodFormattedError<LoginType, string>
		values: LoginType
	}>()

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
				<Form method="post">
					<TextInput
						name="email"
						label="Email:"
						type="email"
						icon={<MdAlternateEmail />}
						error={actionData?.errors?.email?._errors.join("\n")}
						defaultValue={actionData?.values.email}
						required
					/>
					<PasswordInput
						name="password"
						label="Password:"
						mt="xs"
						icon={<BiLockAlt />}
						error={actionData?.errors?.password?._errors.join("\n")}
						defaultValue={actionData?.values.password}
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
