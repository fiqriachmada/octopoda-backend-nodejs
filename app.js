const express = require('express');
const postUsers = require('./app/api/v1/users/postUsers');
const cors = require('cors');

const bodyParser = require('body-parser');
const getUsers = require('./app/api/v1/users/getUsers');
const { getClient, connection } = require('./app/api/v1/database/database');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  // const client = getClient();
  // try {
  //   await client.connect(); // Connect to the database
  const result = await (await connection()).query('SELECT * FROM Users'); // Execute your query
  console.log(result.rows); // Log the results
  res.json({ status: 'ok', result });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: 'Internal server error' });
  // } finally {
  //   await client.end(); // Disconnect from the database
  // }
});

// app.get('/', async (req, res) => {
//   const { rows: connected } = await (await connection()).query('SELECT NOW()');
//   console.log('connected[0].now', connected[0].now);
//   const response = [{ version: '1', time: connected[0].now }];
//   res.json(response[0]);
// });

app.use('/users', getUsers);

app.use('/users', postUsers);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
