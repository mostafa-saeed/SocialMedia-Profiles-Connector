const Joi = require('joi');

module.exports = {
  register: Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),

  login: Joi.object({
    login: Joi.string().required(),
    password: Joi.string().required(),
  }),

  update: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),

};
