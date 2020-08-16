const { promisify } = require('util');
const Hapi = require('@hapi/hapi');
const readdir = promisify(require('fs').readdir);
const { connect, disconnect } = require('mongoose');

const { DB_CONNECTION_STRING, PORT } = require('./config.js');

// Init server instance
const server = new Hapi.Server({
  port: PORT,
});

module.exports = {
  start: async () => {
    // Load all controllers as routes
    const controllers = await readdir(`${__dirname}/controllers`);
    controllers.filter((controller) => controller.endsWith('.js')).forEach((controller) => {
      server.route(require(`./controllers/${controller}`)); // eslint-disable-line
    });
    // Connect to the database
    await connect(DB_CONNECTION_STRING);
    // Run the server
    await server.start();

    return true;
  },

  stop: async () => {
    // Close database connection
    await disconnect();
    // Stop the server
    await server.stop();
    return true;
  },
};
