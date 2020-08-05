const { log } = global.console;
const { ENVIRONMENT } = require('../config.js');

(async () => {
  log('testing', ENVIRONMENT);
})();
