import {
	Anchor,
	Box,
	Button,
	Divider,
	PasswordInput,
	TextInput,
	Title,
} from "@mantine/core"
import {
	Form,
	Link,
	useActionData,
	useLocation,
	useNavigate,
} from "@remix-run/react"
import { motion } from "framer-motion"
import { BsArrowLeft } from "react-icons/bs"
import { arrowStyles } from "~/components/welcome"
import { MdAlternateEmail } from "react-icons/md"
import { BiLockAlt } from "react-icons/bi"
import type { ActionFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import type { SignupType } from "~/models/auth/signup.server"
import { SignupSchema } from "~/models/auth/signup.server"
import type { ZodFormattedError } from "zod"

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData()
	const data = Object.fromEntries(formData)

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

	return null
	// return redirect("../")
}

export default function Signup() {
	const navigate = useNavigate()
	const location = useLocation()

	const actionData = useActionData<{
		errors: ZodFormattedError<SignupType, string>
		values: SignupType
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
				<Title order={2}>Sign Up</Title>
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
					<PasswordInput
						name="repeatPassword"
						label="Repeat password:"
						mt="xs"
						icon={<BiLockAlt />}
						error={actionData?.errors?.repeatPassword?._errors.join(
							" - ",
						)}
						defaultValue={actionData?.values.repeatPassword}
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
						<Button mt="sm" type="submit">
							Submit
						</Button>
					</Box>
				</Form>
			</Box>
		</Box>
	)
}
