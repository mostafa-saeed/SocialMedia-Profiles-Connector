const { ENVIRONMENT, DB_CONNECTION_STRING } = process.env;

module.exports = {
  ENVIRONMENT: ENVIRONMENT || 'development',
  DB_CONNECTION_STRING: DB_CONNECTION_STRING || 'mongodb://localhost/not_testing',
};
