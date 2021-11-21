import cors from 'cors'
import express from 'express'

import auth from './middlewares/auth.js'
import { sendSignUp } from './controllers/signUp.js'
import { makeLogin } from './controllers/login.js'
import { getPlanInfo } from './controllers/mySignature.js'


const app = express()

app.use(cors())
app.use(express.json())


/*
  TODO: Olá Galdino! Que nem neste exemplo aqui, quando não preciso de um dos
  inputs da função, eu vi um pessoal utilizando o '_' ao invés de escrever qual
  quer coisa. Essa é uma prática de bom tom?
*/
app.get('/status', (_, res) => res.sendStatus(200))

app.post('/sign-up', sendSignUp)
app.post('/login', makeLogin)

app.get('/my-signature', auth, getPlanInfo)


export default app
