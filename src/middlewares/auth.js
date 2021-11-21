import connection from '../database/database.js'


const auth = async (req, res, next) => {
	const { authorization } = req.headers
	const token = authorization?.replace('Bearer ', '')


	try {
		const userSession = await getUserSession(token)

		if (!userSession) return res.sendStatus(401)

		req.userId = userSession.user_id

	} catch (error) {
		console.log(error)
		return res.sendStatus(500)
	}

	next()
}

const getUserSession = async (token) => {
	const query = `
		SELECT * FROM sessions
			WHERE token = $1;
	`
	const userSessionPromise = await connection.query(query, [token])

	return userSessionPromise.rows[0]
}


export default auth
