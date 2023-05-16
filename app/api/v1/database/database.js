const pg = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

const sslConfig = {
  rejectUnauthorized: false,
};

const connection = async () => {
  return await getClient();
};

function getClient() {
  const connect = new pg.Client({
    connectionString: databaseUrl,
    ssl: sslConfig,
  });
  return connect.connect().then(() => connect);
}

module.exports = { connection };
