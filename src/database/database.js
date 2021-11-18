import pg from 'pg'

const { Pool } = pg


const {
	NODE_ENV,
	DB_HOST,
	DB_PORT,
	DB_USER,
	DB_NAME,
	DB_PASS,
} = process.env

const databaseConfig = (NODE_ENV === 'production')
	? {
		connectionString: process.env.DATABASE_URL,
		ssl: {
			rejectUnauthorized: false,
		}
	}
	: {
		host: DB_HOST,
		port: DB_PORT,
		user: DB_USER,
		database: DB_NAME,
		password: DB_PASS
	}

const connection = new Pool (databaseConfig)


export default connection
