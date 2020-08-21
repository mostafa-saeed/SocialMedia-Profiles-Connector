const { add } = require('../schemas/userPlatforms');
const { getPlatform } = require('../services/platforms');
const UserPlatforms = require('../models/userPlatforms');

module.exports = [{
  method: 'post',
  path: '/api/users/platforms/{name}',
  config: {
    auth: { strategy: 'jwt' },
    validate: { payload: add },
    pre: [
      { method: getPlatform, assign: 'platform' },
    ],
    handler: async (req) => {
      const { username } = req.payload;
      const { id: platform } = req.pre.platform;
      const { id: user } = req.auth.credentials.user;
      const test = await UserPlatforms.create({
        platform,
        user,
        username,
      });

      return test;
    },
  },
}];
