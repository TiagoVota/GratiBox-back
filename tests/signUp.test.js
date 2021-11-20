/* eslint-disable no-undef */
import supertest from 'supertest'

import '../src/setup.js'
import app from '../src/app.js'
import connection from '../src/database/database.js'
import { clearTablesFactory } from '../src/factories/clearTablesFactory.js'
import { createUserFactory } from '../src/factories/userFactory.js'
import { signUpBodyFactory } from '../src/factories/bodyFactory.js'


beforeEach(async () => {
	await clearTablesFactory()
	await createUserFactory()
})

afterAll(async () => {
	await clearTablesFactory()
	await connection.end()
})


describe('GET /status', () => {
	const invalidBody = signUpBodyFactory('invalid')
	const conflictBody = signUpBodyFactory()
	const validBody = signUpBodyFactory()

	test('Return 422 for invalid body', async () => {
		await signUpTest(invalidBody, 422)
	})

	test('Return 409 for conflict body', async () => {
		console.log({conflictBody})
		await createUserFactory(conflictBody)
		await signUpTest(conflictBody, 409)
	})

	test('Return 201 for correct body', async () => {
		await signUpTest(validBody, 201)
	})
})


const signUpTest = async (body, status) => {
	const result = await supertest(app)
		.post('/sign-up')
		.send(body)

	expect(result.status).toEqual(status)
}
