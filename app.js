const express = require('express');
const postUsers = require('./app/api/v1/users/postUsers');
const cors = require('cors');

const bodyParser = require('body-parser');
const getUsers = require('./app/api/v1/users/getUsers');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json(['Welcome to Octopoda version: 1 ']);
});

app.use('/users', getUsers);

app.use('/users', postUsers);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
