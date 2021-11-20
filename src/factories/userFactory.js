import faker from 'faker'
import bcrypt from 'bcrypt'

import connection from '../database/database.js'


faker.locale = 'pt_BR'

const createUserFactory = async (userInfo) => {
	const name = userInfo?.name || faker.name.firstName()
	const email = userInfo?.email || faker.internet.email().toLowerCase()
	const password = userInfo?.password || faker.internet.password()
	const hash = bcrypt.hashSync(password, 12)

	await connection.query(`
		INSERT INTO users
			(name, email, password)
		VALUES 
			($1, $2, $3);
	`, [name, email, hash])

	const userPromise = await connection.query(`
		SELECT * FROM users
			WHERE email = $1;
	`, [email])

	return userPromise.rows[0]
}


export { createUserFactory }
