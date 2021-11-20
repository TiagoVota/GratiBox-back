import bcrypt from 'bcrypt'

import connection from '../database/database.js'
import theValidationProceeded from '../validations/handleValidation.js'
import validateSignUp from '../validations/validation.signUp.js'


const sendSignUp = async (req, res) => {
	const { body: singUpInfo } = req
	const {
		name,
		email,
		password,
	} = singUpInfo

	const isValidSignUp = theValidationProceeded({
		res,
		status: 422,
		objectToValid: singUpInfo,
		objectValidation: validateSignUp
	})

	if (!isValidSignUp) return

	const hash = bcrypt.hashSync(password, 12)
	const lowerEmail = email.toLowerCase()

	try {
		const isRegistered = await isUserRegistered(lowerEmail)
		if (isRegistered) return res.status(409).send('E-mail já cadastrado!')

		await registerUser(name, lowerEmail, hash)

		return res.status(201).send({name, email: lowerEmail})

	} catch (error) {
		console.log(error)
		return res.sendStatus(500)
	}
}

const isUserRegistered = async (email) => {
	const query = `
		SELECT * FROM users
			WHERE email = $1;
	`
	const registeredUserPromise = await connection.query(query, [email])
	return Boolean(registeredUserPromise.rowCount)
}

const registerUser = async (name, email, hash) => {
	const query = `
		INSERT INTO users
			(name, email, password)
		VALUES
			($1, $2, $3);
	`
	await connection.query(query, [name, email, hash])
}


export { sendSignUp }
