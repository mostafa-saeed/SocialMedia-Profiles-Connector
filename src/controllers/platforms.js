const { getPlatforms } = require('../services/platforms');

module.exports = [{
  method: 'get',
  path: '/api/platforms',
  config: {
    handler: getPlatforms,
  },
}];
