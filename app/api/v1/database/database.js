var pg = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const databaseHost = process.env.DATABASE_HOST;
const databasePort = process.env.DATABASE_PORT;
const databaseName = process.env.DATABASE_NAME;
const databaseUser = process.env.DATABASE_USER;
const databasePassword = process.env.DATABASE_PASSWORD;

const config = new pg.Pool({
  host: databaseHost,
  port: databasePort,
  database: databaseName,
  user: databaseUser,
  password: databasePassword,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync('./root.crt').toString(),
  },
  connectionTimeoutMillis: 50000,
});

const connection = async () => {
  return await getConnection();
};

async function getConnection() {
  console.log('>>>> Connecting to YugabyteDB!');
  try {
    const connected = await config.connect();
    console.log('>>>> Connected to YugabyteDB! with Host ' + databaseHost);
    return connected;
  } catch (err) {
    console.log(
      '>>>> Connection Failed to YugabyteDB! with Host ' + databaseHost,
      'Error: '
    );
    console.log(err);
  }
}

module.exports = { connection };
