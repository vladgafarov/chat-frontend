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

export default function Signup() {
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
				<Box sx={arrowStyles} onClick={() => navigate("../")}>
					<BsArrowLeft size={23} />
				</Box>
				<Title order={2}>Sign Up</Title>
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
					<PasswordInput
						label="Repeat password:"
						mt="xs"
						icon={<BiLockAlt />}
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
