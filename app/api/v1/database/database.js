var pg = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const databaseHost = process.env.DATABASE_HOST;
const databasePort = process.env.DATABASE_PORT;
const databaseName = process.env.DATABASE_NAME;
const databaseUser = process.env.DATABASE_USER;
const databasePassword = process.env.DATABASE_PASSWORD;

const config = {
  host: databaseHost,
  port: databasePort,
  database: databaseName,
  user: databaseUser,
  password: databasePassword,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync('./root.crt').toString(),
  },
  connectionTimeoutMillis: 5000,
};

async function connect(callbackHandler) {
  console.log('>>>> Connecting to YugabyteDB!');

  try {
    client = new pg.Client(config);

    await client.connect();

    console.log('>>>> Connected to YugabyteDB!');

    callbackHandler(null, client);
  } catch (err) {
    callbackHandler(err);
  }
}

module.exports = { connect };
