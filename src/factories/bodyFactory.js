import faker from 'faker'


faker.locale = 'pt_BR'


const signUpBodyFactory = (type, userInfo) => {
	const name = userInfo?.name || faker.name.firstName()
	const email = userInfo?.email || faker.internet.email().toLowerCase()
	const password = userInfo?.password || faker.internet.password()
	const repeatPassword = password

	const validBody = {
		name,
		email,
		password,
		repeatPassword
	}

	if (type === 'invalid') {
		const invalidPassword = ''

		const invalidBody = {
			...validBody,
			password: invalidPassword
		}

		return invalidBody
	}

	return validBody
}


export { signUpBodyFactory }
