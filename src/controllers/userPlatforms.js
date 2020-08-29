const { add } = require('../schemas/userPlatforms');
const { getUser } = require('../services/users');
const { getPlatform } = require('../services/platforms');
const { getUserPlatform, validateUsername, addUserPlatform } = require('../services/userPlatforms');

module.exports = [{
  method: 'get',
  path: '/api/users/{username}/{platform}',
  config: {
    pre: [
      { method: getUser, assign: 'user' },
      { method: getPlatform, assign: 'platform' },
    ],
    handler: getUserPlatform,
  },
},

{
  method: 'post',
  path: '/api/users/platforms/{platform}',
  config: {
    auth: { strategy: 'jwt' },
    validate: { payload: add },
    pre: [
      { method: getPlatform, assign: 'platform' },
      { method: validateUsername },
    ],
    handler: addUserPlatform,
  },
}];
