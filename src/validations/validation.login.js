import joi from 'joi'


const validateLogin = joi.object({
	email: joi.string().email().required(),
	password: joi.string().min(3).max(42).required()
}).length(2)


export default validateLogin
