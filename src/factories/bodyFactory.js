import faker from 'faker'


faker.locale = 'pt_BR'

const signUpBodyFactory = (type, userInfo) => {
	const name = userInfo?.name || faker.name.firstName()
	const email = (userInfo?.email || faker.internet.email()).toLowerCase()
	const password = userInfo?.password || faker.internet.password()
	const repeatPassword = password
	const invalidPassword = ''


	const validBody = {
		name,
		email,
		password,
		repeatPassword
	}

	if (type === 'invalid') {
		const invalidBody = {
			...validBody,
			password: invalidPassword
		}

		return invalidBody
	}

	return validBody
}

const loginBodyFactory = (type, userInfo) => {
	const email = (userInfo?.email || faker.internet.email()).toLowerCase()
	const password = userInfo?.password || faker.internet.password()
	const invalidEmail = faker.name.firstName()

	const validBody = {
		email,
		password
	}

	if (type === 'invalid') {
		const invalidBody = {
			...validBody,
			email: invalidEmail
		}

		return invalidBody
	}

	return validBody
}


export {
	signUpBodyFactory,
	loginBodyFactory,
}
