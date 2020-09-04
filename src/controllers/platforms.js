const { platformsResponse } = require('../schemas/platforms');
const { getPlatforms } = require('../services/platforms');

module.exports = [{
  method: 'get',
  path: '/api/platforms',
  config: {
    handler: getPlatforms,
    response: { schema: platformsResponse },
    description: 'Get all platforms.',
    tags: ['api'],
  },
}];
