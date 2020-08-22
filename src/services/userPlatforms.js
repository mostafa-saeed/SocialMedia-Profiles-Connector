const { notFound, badRequest } = require('@hapi/boom');
const UserPlatforms = require('../models/userPlatforms');

const userPlatformResponse = ({ _id: id, username }, profileURL) => ({
  id,
  username,
  url: `${profileURL}/${username}`,
});

module.exports = {
  getUserPlatform: async (req) => {
    const { user: { id: user }, platform: { id: platform } } = req.pre;

    const userPlatform = await UserPlatforms.findOne({
      user,
      platform,
    });

    if (!userPlatform) throw notFound('UserPlatform doesn\'t exist');

    return userPlatform;
  },

  validateUsername: (req) => {
    const { pattern } = req.pre.platform;
    const { username } = req.payload;
    if (!(new RegExp(pattern).test(username))) {
      throw badRequest('Invalid username');
    }

    return true;
  },

  addUserPlatform: async (req) => {
    const { username } = req.payload;
    const { id: platform } = req.pre.platform;
    const { id: user } = req.auth.credentials.user;

    const userPlatform = await UserPlatforms.findOneAndUpdate(
      { platform, user },
      { username },
      { upsert: true, new: true },
    );

    return userPlatformResponse(userPlatform, req.pre.platform.profileURL);
  },
};
