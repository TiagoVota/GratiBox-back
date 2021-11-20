import supertest from 'supertest'

import '../src/setup.js'
import app from '../src/app.js'
import connection from '../src/database/database.js'
import { clearTablesFactory } from '../src/factories/clearTablesFactory.js'
import { createUserFactory } from '../src/factories/userFactory.js'
import { loginBodyFactory } from '../src/factories/bodyFactory.js'


beforeEach(async () => {
	await clearTablesFactory()
	await createUserFactory()
})

afterAll(async () => {
	await clearTablesFactory()
	await connection.end()
})


describe('POST /login', () => {
	const invalidBody = loginBodyFactory('invalid')
	const unauthorizedBody = loginBodyFactory()
	const validBody = loginBodyFactory()

	test('Return 422 for invalid body', async () => {
		await loginTest(invalidBody, 422)
	})

	test('Return 401 for unauthorized body', async () => {
		await loginTest(unauthorizedBody, 401)
	})
	
	test('Return 200 for correct body', async () => {
		await createUserFactory(validBody)
		await loginTest(validBody, 200)
	})
})


const loginTest = async (body, status) => {
	const result = await supertest(app)
		.post('/login')
		.send(body)

	expect(result.status).toEqual(status)
}
