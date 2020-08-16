const { promisify } = require('util');
const Hapi = require('@hapi/hapi');
const jwt2 = require('hapi-auth-jwt2');
const readdir = promisify(require('fs').readdir);
const { connect, disconnect } = require('mongoose');

const { validateToken } = require('./services/auth');

const { DB_CONNECTION_STRING, PORT, JWT_TOKEN } = require('./config.js');

module.exports = {
  start: async () => {
    // Init server instance
    const server = new Hapi.Server({
      port: PORT,
    });
    // Register jwt2 plugin
    await server.register(jwt2);
    // Configure server auth
    server.auth.strategy('jwt', 'jwt', {
      key: JWT_TOKEN,
      validate: validateToken,
      verifyOptions: { algorithms: ['HS256'] },
    });
    // Load all controllers as routes
    const controllers = await readdir(`${__dirname}/controllers`);
    controllers.filter((controller) => controller.endsWith('.js')).forEach((controller) => {
      server.route(require(`./controllers/${controller}`)); // eslint-disable-line
    });
    // Connect to the database
    await connect(DB_CONNECTION_STRING);
    // Run the server
    await server.start();
    // Return server instance
    return server;
  },

  stop: async (server) => {
    // Close database connection
    await disconnect();
    // Stop the server
    server.stop();
    return true;
  },
};
