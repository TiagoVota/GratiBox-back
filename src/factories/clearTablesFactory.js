import connection from '../database/database.js'


const clearTablesFactory = async (tableList) => {
	const dbTables = [
		'states',
		'addresses',
		'signatures_products',
		'subscriptions',
		'sessions',
		'products',
		'frequencies',
		'plans',
		'users',
	]

	const tablesToClear = tableList || dbTables

	const deleteStr = tableName => `DELETE FROM ${tableName};`

	const query = tablesToClear.reduce((acc, cur) => acc + deleteStr(cur), '')

	await connection.query(query)
}

export { clearTablesFactory }