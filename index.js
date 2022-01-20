const express = require('express');
const exphbs = require('express-handlebars');
const pg = require('pg');
const Pool = pg.Pool;

const app = express();
const PORT = process.env.PORT || 3017;

const ElectricityMeters = require('./electricity-meters');


const connectionString = process.env.DATABASE_URL || 'postgresql://bonisiwecukatha:pg123@localhost:5432/topups_db';

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}

const pool = new Pool({
   
    ssl: { rejectUnauthorized: false }

});


// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const electricityMeters = ElectricityMeters(pool);

app.get('/', async function (req, res) {

	let show = await electricityMeters.streets()

	res.render('streets', {
		show: show
	});
});


app.get('/appliance', async function (req, res) {

	let appliance = await electricityMeters.appliances()
	console.log(appliance);
	res.render('streets', {
		appliance: appliance
	});
});


app.get('/meter/:street_id', async function (req, res) {


	let meters = await electricityMeters.meterData(req.params.street_id)

	console.log(meters + "jjjjjjjjjj");
	// use the streetMeters method in the factory function...
	// send the street id in as sent in by the URL parameter street_id - req.params.street_id

	// create  template called street_meters.handlebars
	// in there loop over all the meters and show them on the screen.
	// show the street number and name and the meter balance

	res.render('street_meters', {
		meters
	});
});

// app.get('/meter/use/:meter_id', async function(req, res) {

// 	// show the current meter balance and select the appliance you are using electricity for
// 	res.render('use_electicity', {
// 		meters
// 	});
// });

// app.post('/meter/use/:meter_id', async function(req, res) {

// 	// update the meter balance with the usage of the appliance selected.
// 	res.render(`/meter/user/${req.params.meter_id}`);

// });

// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function () {
	console.log(`App started on port ${PORT}`)
});