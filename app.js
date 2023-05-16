const express = require('express');
const postUsers = require('./app/api/v1/users/postUsers');
const cors = require('cors');

const bodyParser = require('body-parser');
const getUsers = require('./app/api/v1/users/getUsers');
const { connection } = require('./app/api/v1/database/database');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  const { rows: connected } = await (await connection()).query('SELECT NOW()');
  console.log('connected[0].now', connected[0].now);
  res.json(['Welcome to Octopoda version: 1 ', connected[0].now]);
});

app.use('/users', getUsers);

app.use('/users', postUsers);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
