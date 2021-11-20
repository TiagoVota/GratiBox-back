/*
	TODO: Olá Galdino! Para essa função aqui eu não soube que nome poderia colocar
	porque ela faz tanto o trabalho de lidar com a validação quanto o trabalho de
	retornar se é válido ou não, então queria alguma sugestão para nome, pois
	geralmente eu colocaria direto um "handleValidation" ou "isValid"
*/
import pkg from 'joi-translation-pt-br'
const { messages } = pkg


const theValidationProceeded = (params) => {
	const {
		res, 
		status, 
		objectToValid, 
		objectValidation
	} = params

	const objectError = objectValidation.validate(objectToValid, {messages}).error

	if (objectError) res.status(status).send(objectError.details[0].message)

	return !objectError
}


export default theValidationProceeded
