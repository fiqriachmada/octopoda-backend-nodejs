// const connection = require('../database/database.js');
const { Router } = require('express');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { connection } = require('../database/database');

const postUsers = Router();

const saltRounds = 10;

postUsers.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  console.log('username, password, email', username, password, email);
  try {
    const checkUsernameQuery =
      'SELECT COUNT(*) as count FROM users WHERE username = $1';
    const checkEmailQuery =
      'SELECT COUNT(*) as count FROM users WHERE email = $1';

    const { rows: usernameRows } = await (
      await connection()
    ).query(checkUsernameQuery, [username]);
    const { rows: emailRows } = await (
      await connection()
    ).query(checkEmailQuery, [email]);

    const usernameTaken = usernameRows[0].count > 0;
    const emailTaken = emailRows[0].count > 0;

    if (usernameTaken) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    if (emailTaken) {
      return res.status(400).json({ message: 'Email already taken' });
    }

    const id = uuidv4();

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

    console.log('username, password, email, id', username, password, email, id);

    const query =
      'INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4)';
    const values = [id, username, email, hashedPassword];
    await (await connection()).query(query, values);

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
