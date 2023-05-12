const { Router } = require('express');
// const connect = require('./database/database.js');

const getUsers = Router();

getUsers.get('/', async (req, res) => {
  try {
    const { rows } = await client.query('SELECT * FROM users');
    console.log(rows);
    res.json(rows);
  } finally {
    client.end();
  }
});
//  {
//   const client = await connect();

// }

module.exports = getUsers;
