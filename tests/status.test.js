/* eslint-disable no-undef */
import supertest from 'supertest'

import '../src/setup.js'
import app from '../src/app.js'
import connection from '../src/database/database.js'
import { clearTablesFactory } from '../src/factories/clearTablesFactory.js'


beforeAll(async () => await clearTablesFactory())

afterAll(async () => {
	await clearTablesFactory()
	await connection.end()
})

describe('GET /status', () => {
	test('return 200 for accepted connection', async () => {
		const result = await supertest(app).get('/status')

		expect(result.status).toEqual(200)
	})
})
