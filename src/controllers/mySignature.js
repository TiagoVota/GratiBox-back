import dayjs from 'dayjs'

import connection from '../database/database.js'


const getPlanInfo = async (req, res) => {
	const userId = req.userId

	try {
		const subscription = await getSubscription(userId)

		if (!subscription) return res.status(404).send('Sem assinatura!')

		const subscriptionInfo = await getSubscriptionInfo(userId)
		const sanitizedInfo = sanitizedSubscriptionInfo(subscriptionInfo)

		const productsTypes = await getSignatureProducts(subscriptionInfo.id)

		const signatureInfo = {
			... sanitizedInfo,
			productsTypes
		}

		return res.status(200).send(signatureInfo)

	} catch (error) {
		console.log(error)
		return res.sendStatus(500)
	}
}

const getSubscription = async (userId) => {
	const query = `
		SELECT * FROM subscriptions
			WHERE user_id = $1;
	`
	const subscriptionPromise = await connection.query(query, [userId])

	return subscriptionPromise.rows[0]
}

const getSubscriptionInfo = async (userId) => {
	const query = `
		SELECT
			p.id,
			p.name AS type,
			week_day,
			month_day,
			date_start AS "startDate"
		FROM subscriptions AS s 
			JOIN plans AS p
					ON s.plan_id = p.id
			JOIN frequencies AS f
					ON s.frequency_id = f.id
		WHERE user_id = $1;
	`
	const subscriptionInfoPromise = await connection.query(query, [userId])

	return subscriptionInfoPromise.rows[0]
}

const getSignatureProducts = async (subscriptionId) => {
	const query = `
		SELECT p.name FROM signatures_products AS sp
			JOIN products as p
					ON sp.product_id = p.id
		WHERE subscription_id = $1;
	`
	const productsPromise = await connection.query(query, [subscriptionId])

	return productsPromise.rows.map(product => product.name)
}

const sanitizedSubscriptionInfo = (subscriptionInfo) => {
	const {
		type,
		week_day,
		month_day,
		startDate
	} = subscriptionInfo

	const nextDeliveries = makeDeliveryDates(week_day, month_day)

	const sanitizedInfo = {
		type,
		startDate: dayjs(startDate).format('DD/MM/YYYY'),
		nextDeliveries,
	}

	return sanitizedInfo
}

const makeDeliveryDates = (weekDay, monthDay) => {
	const type = weekDay ? 'd' : 'M'
	const day = weekDay || monthDay

	// TODO: Olá Galdino, aceito uma sugestão de nome aqui!
	const utils = {
		'M' : {
			makeBaseDay: makeBaseMonth,
			unit: 1,
		},
		'd' : {
			makeBaseDay: makeBaseWeekday,
			unit: 7,
		},
	}

	const baseDay = utils[type].makeBaseDay(day)
	const todayDay = dayjs().format('YYYY-MM-DD')
	const incrementer = (todayDay > baseDay) ? 1 : 0

	// TODO: Olá Galdino! Alguma sugestão rápida de como criar um array não empty?
	const dates = [...'123'].map((_, idx) => {
		const jumpDays = (idx + incrementer) * utils[type].unit
		const date = dayjs(baseDay).add(jumpDays, type)
		
		return jumpWeekends(date).format('DD/MM/YYYY')
	})

	return dates
}

const makeBaseMonth = monthDay => dayjs().date(monthDay).format('YYYY-MM-DD')
const makeBaseWeekday = weekDay => dayjs().day(weekDay).format('YYYY-MM-DD')

const jumpWeekends = (date) => {
	const weekday = date.day()

	if (weekday === 6) return date.add(2, 'd')
	if (weekday === 0) return date.add(1, 'd')

	return date
}


export { getPlanInfo }
