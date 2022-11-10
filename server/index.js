const keys = require('./keys');

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// receives and responds HTTP requests
const app = express();
// cors will allow us to make requests from different domain react web app
// to backend on different domain or port (in our case)
app.use(cors());
app.use(bodyParser.json());

// Postgres client setup
const { Pool } = require('pg');
const pgClient = new Pool({
	user: keys.pgUser,
	host: keys.pgHost,
	database: keys.pgDatabase,
	password: keys.pgPassword,
	port: keys.pgPort
});
pgClient.on('error', () => console.log('Lost PG connection'));
pgClient.on('connect', (client) => {
	client
		.query('CREATE TABLE IF NOT EXISTS values(number INT)')
		.catch((err) => console.error(err));
});

// Redis client setup
const redis = require('redis');
const redisClient = redis.createClient({
	host: keys.redisHost,
	port: keys.redisPort,
	retry_strategy: () => 1000
});

// redis conection can only listen or only publish, 
// therfore we are creating duplicate
const redisPublisher = redisClient.duplicate();

// Express route handlers

app.get('/', (req, resp) => {
	res.send('Hi');
});

app.get('/values/all', async (req, resp) => {
	const values = await pgClient.query('SELECT * from values');

	resp.send(values.rows);
})

app.get('/values/current', async (req, resp) => {
	redisClient.hgetall('values', (err, values) => {
		resp.send(values);
	});
});

app.post('/values', async (req, resp) => {
	const index = req.body.index;
	if (parseInt(index) > 40) {
		return res.status(422).send('Index too high');
	}
	redisClient.hset('values', index, 'Nothing yet!');
	redisPublisher.publish('insert', index);
	pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

	resp.send({ working: true });
});


app.listen(5000, err => {
	console.log('Listening');
});

