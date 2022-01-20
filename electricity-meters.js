// this is our
module.exports = function electricityMeters(pool) {

	// list all the streets the we have on records
	async function streets() {
		const streets = await pool.query(`select * from street`);
		return streets.rows;
	}

	// for a given street show all the meters and their balances
	async function streetMeters(streetId) {
		let data = await pool.query('select meter_number,balance from electricity_meter where meter_number = $1', [streetId])
		return data.rows
	}

	// return all the appliances
	async function appliances() {
		let allAppliances = await pool.query('select * from appliance');
		return allAppliances.rows;

	}

	// increase the meter balance for the meterId supplied
	async function topupElectricity(units, meterId) {
		let topup = await pool.query('update electricity_meter set balance = $1 where meter_number = $2'[units, meterId])
		return topup.rows
	}

	// return the data for a given balance
	async function meterData(meterId) {
		let data = await pool.query('select * from electricity_meter join street on street.id = electricity_meter.street_id where meter_number = $1', [meterId])
		return data.rows

	}

	// decrease the meter balance for the meterId supplied
	async function useElectricity(meterId, units) {

	}
	async function lowestBalanceMeter() {
		let lowestBalance = await pool.query('select street_number, street_id, balance from electricity_meter join street on street.id = electricity_meter.street_id order by  balance desc limit 1')
		return lowestBalance.rows
	}

	async function highestBalanceMeter() {
		let highestBalance = await pool.query('select street_number, street_id, balance from electricity_meter join street on street.id = electricity_meter.street_id order by  balance asc limit 1')
		return highestBalance.rows

	}

	return {
		streets,
		streetMeters,
		appliances,
		topupElectricity,
		meterData,
		useElectricity,
		lowestBalanceMeter,
		highestBalanceMeter
	}


}