const Joi = require('joi');

module.exports = {
  add: Joi.object({
    username: Joi.string().required(),
  }),
};
