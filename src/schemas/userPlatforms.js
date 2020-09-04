const Joi = require('joi');

const userPlatformResponse = Joi.object({
  id: Joi.string().example('5f509cdf9532620edf41fd1b'),
  username: Joi.string().example('mostafa'),
  url: Joi.string().uri().example('https://fb.com/mostafa'),
}).label('UserPlatformResponse');

module.exports = {
  addUserPlatformSchema: {
    payload: Joi.object({
      username: Joi.string().required(),
    }).label('AddUserPlatformPayload'),
  },

  getUserPlatformSchema: {
    params: Joi.object({
      username: Joi.string().example('mostafa'),
      platform: Joi.string().example('facebook'),
    }),
  },

  userPlatformResponse,
};
