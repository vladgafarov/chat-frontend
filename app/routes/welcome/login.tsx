import {
	Anchor,
	Box,
	Button,
	Divider,
	PasswordInput,
	TextInput,
	Title,
} from "@mantine/core"
import { Form, Link, useLocation, useNavigate } from "@remix-run/react"
import { motion } from "framer-motion"
import { BsArrowLeft } from "react-icons/bs"
import { arrowStyles } from "~/components/welcome"
import { MdAlternateEmail } from "react-icons/md"
import { BiLockAlt } from "react-icons/bi"

export default function Login() {
	const navigate = useNavigate()
	const location = useLocation()

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
				<Box sx={arrowStyles} onClick={() => navigate(-1)}>
					<BsArrowLeft size={23} />
				</Box>
				<Title order={2}>Log In</Title>
			</Box>

			<Box mt="sm">
				<Form>
					<TextInput
						label="Email:"
						type="email"
						icon={<MdAlternateEmail />}
						required
					/>
					<PasswordInput
						label="Password:"
						mt="xs"
						icon={<BiLockAlt />}
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
						<Button mt="sm" type="submit">
							Submit
						</Button>
					</Box>
				</Form>
			</Box>
		</Box>
	)
}
