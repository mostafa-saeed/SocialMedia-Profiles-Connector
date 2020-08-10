const {
  NODE_ENV, PORT, DB_CONNECTION_STRING, JWT_TOKEN,
} = process.env;

module.exports = {
  NODE_ENV: NODE_ENV || 'development',
  PORT: PORT || 3000,
  DB_CONNECTION_STRING: DB_CONNECTION_STRING || 'mongodb://localhost/not_testing',
  JWT_TOKEN: JWT_TOKEN || 'Dev10pmeNTT0kun',
};
