const Joi = require('joi');

module.exports = {
  registerSchema: {
    payload: Joi.object({
      username: Joi.string().required().example('mostafa'),
      email: Joi.string().email().required().example('mostafa@gmail.com'),
      password: Joi.string().required().min(8),
    }).label('User'),
  },

  getUserSchema: {
    params: Joi.object({
      username: Joi.string().required().example('mostafa'),
    }),
  },

  loginSchema: {
    payload: Joi.object({
      login: Joi.string().required(),
      password: Joi.string().required(),
    }).label('Login'),
  },

  userResponse: Joi.object({
    user: Joi.object({
      id: Joi.string(),
      username: Joi.string(),
      email: Joi.string().email(),
      platforms: Joi.array().items(Joi.object()),
    }),
    token: Joi.string(),
  }).label('UserResponse'),

};
