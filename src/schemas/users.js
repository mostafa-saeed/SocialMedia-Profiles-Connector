const Joi = require('joi');
const { userPlatformResponse } = require('./userPlatforms');

const userResponse = Joi.object({
  id: Joi.string().example('5f509cdf9532620edf41fd1b'),
  username: Joi.string().example('mostafa'),
  email: Joi.string().email().example('mostafa@gmail.com'),
  platforms: Joi.array().items(userPlatformResponse).label('UserPlatforms'),
}).label('UserResponse');

const loginResponse = Joi.object({
  user: userResponse,
  token: Joi.string(),
}).label('LoginResponse');

module.exports = {
  registerSchema: {
    payload: Joi.object({
      username: Joi.string().required().example('mostafa'),
      email: Joi.string().email().required().example('mostafa@gmail.com'),
      password: Joi.string().required().min(8),
    }).label('RegisterPayload'),
  },

  getUserSchema: {
    params: Joi.object({
      username: Joi.string().required().example('mostafa'),
    }),
  },

  loginSchema: {
    payload: Joi.object({
      login: Joi.string().required().description('Username or email'),
      password: Joi.string().required(),
    }).label('LoginPayload'),
  },

  profileSchema: {
    headers: Joi.object({
      authorization: Joi.string().required(),
    }).label('ProfilePayload').unknown(),
  },

  userResponse,

  loginResponse,

};
