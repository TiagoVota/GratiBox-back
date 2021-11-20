import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'

import connection from '../database/database.js'
import theValidationProceeded from '../validations/handleValidation.js'
import validateLogin from '../validations/validation.login.js'


const makeLogin = async (req, res) => {
	const { body: loginInfo } = req
	const {
		email,
		password,
	} = loginInfo

	const isValidLogin = theValidationProceeded({
		res,
		status: 422,
		objectToValid: loginInfo,
		objectValidation: validateLogin
	})

	if (!isValidLogin) return

	const lowerEmail = email.toLowerCase()

	try {
		const userData = await registeredUser(lowerEmail)
		// TODO: Galdino, tem alguma forma de fazer o compareSync com um undefined?
		const hash = userData?.password || ''

		const isValidPassword = bcrypt.compareSync(password, hash)
		if (!userData || !isValidPassword) {
			return res.status(401).send('E-mail e/ou senha incorretos(s)!')
		}

		const token = await makeSession(userData.id)

		const sendInfo = {
			name: userData.name,
			email: lowerEmail,
			token,
			isSubscriber: userData.is_subscriber
		}

		return res.status(200).send(sendInfo)

	} catch (error) {
		console.log(error)
		return res.sendStatus(500)
	}
}

const registeredUser = async (email) => {
	const query = `
		SELECT * FROM users
			WHERE email = $1;
	`
	const registeredUserPromise = await connection.query(query, [email])

	return registeredUserPromise.rows[0]
}

const makeSession = async (userId) => {
	const token = uuid()
	
	const existentSessionId = await existentSession(userId)
	
	existentSessionId
		? await updateSession(existentSessionId, token)
		: await insertSession(userId, token)
	
	return token
}

const existentSession = async (userId) => {
	const existentUserPromise = await connection.query(`
    SELECT * FROM sessions
      WHERE user_id = $1;
  `, [userId])
	const existentUser = existentUserPromise.rows[0]

	return existentUser?.id
}

const updateSession = async (sessionId, token) => {
	await connection.query(`
  UPDATE sessions
  SET token = $1
    WHERE id = $2;
  `, [token, sessionId])
}

const insertSession = async (userId, token) => {
	await connection.query(`
    INSERT INTO sessions
      (user_id, token)
    VALUES
      ($1, $2);
  `, [userId, token])
}


export { makeLogin }
