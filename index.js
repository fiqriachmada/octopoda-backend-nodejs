const express = require('express');
const postUsers = require('./app/api/v1/users/postUsers');
const cors = require('cors');

const bodyParser = require('body-parser');
const getUsers = require('./app/api/v1/users/getUsers');
const { connection } = require('./app/api/v1/database/database');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  // const client = getClient();
  try {
    // await client.connect(); // Connect to the database
    const result = await (await connection()).query('SELECT * FROM Users'); // Execute your query
    console.log(result.rows); // Log the results
    res.json({ status: res.statusCode, data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await (await connection()).end(); // Disconnect from the database
  }
});

app.use('/users', getUsers);

app.use('/users', postUsers);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
