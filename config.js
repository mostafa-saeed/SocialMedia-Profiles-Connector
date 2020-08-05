const { ENVIRONMENT } = process.env;

module.exports = {
  ENVIRONMENT: ENVIRONMENT || 'development',
};
