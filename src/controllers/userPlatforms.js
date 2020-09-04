const {
  addUserPlatformSchema, userPlatformResponse, getUserPlatformSchema,
} = require('../schemas/userPlatforms');
const { getUser } = require('../services/users');
const { getPlatform } = require('../services/platforms');
const { getUserPlatform, validateUsername, addUserPlatform } = require('../services/userPlatforms');

module.exports = [{
  method: 'get',
  path: '/api/users/{username}/{platform}',
  config: {
    validate: getUserPlatformSchema,
    pre: [
      { method: getUser, assign: 'user' },
      { method: getPlatform, assign: 'platform' },
    ],
    handler: getUserPlatform,
    response: { schema: userPlatformResponse },
    description: 'Get a userPlatform.',
    tags: ['api'],
  },
},

{
  method: 'post',
  path: '/api/users/platforms/{platform}',
  config: {
    auth: { strategy: 'jwt' },
    validate: addUserPlatformSchema,
    pre: [
      { method: getPlatform, assign: 'platform' },
      { method: validateUsername },
    ],
    handler: addUserPlatform,
    response: { schema: userPlatformResponse },
    description: 'Add a userPlatform.',
    tags: ['api'],
  },
}];
