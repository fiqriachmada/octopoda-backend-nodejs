// const connection = require('../database/database.js');
const { Router } = require('express');
const v4 = require('uuid');
const bcrypt = require('bcrypt');
const connection = require('../database/database');
const client = require('../database/database');
const getConnection = require('../database/database');

const postUsers = Router();

const saltRounds = 10;

postUsers.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const checkQuery =
      'SELECT COUNT(*) as count FROM users WHERE username = $1';
    const { rows } = await client.query(checkQuery, [username]);
    const usernameTaken = rows[0].count > 0;

    if (usernameTaken) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const id = v4();

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Username, email and password are required' });
    } else if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    } else if (username.length < 6) {
      return res
        .status(400)
        .json({ message: 'Username must be at least 6 characters' });
    } else if (!email) {
      return res.status(400).json({ message: 'E-mail is required' });
    } else if (!email.includes('@')) {
      return res.status(400).json({ message: 'Email must contain @' });
    } else if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    } else if (
      !/^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
    ) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters and contain at least one special character',
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query =
      'INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4)';
    const values = [id, username, email, hashedPassword];
    // await (await connection).query(query, values);

    // getConnection()

    connection.connect(values)


    const response = {
      status: res.statusCode,
      data: { id, username, email, password, hashedPassword },
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(response);
  } catch (error) {
    console.log(error.message);
    const response = {
      status: 500,
      message: 'Failed to insert character data',
      error: error.message,
    };
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json(response);
  }
});

module.exports = postUsers;
