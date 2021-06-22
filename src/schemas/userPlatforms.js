const Joi = require('joi');

const userPlatformResponse = Joi.object({
  name: Joi.string().example('facebook'),
  username: Joi.string().example('mostafa'),
  url: Joi.string().example('https://fb.com/mostafa'),
}).label('UserPlatformResponse');

module.exports = {
  addUserPlatformSchema: {
    headers: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
    params: Joi.object({
      platform: Joi.string().example('facebook'),
    }),
    payload: Joi.object({
      username: Joi.string().required().example('mostafa'),
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
