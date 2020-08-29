const Joi = require('@hapi/joi');

module.exports = {
  add: Joi.object({
    username: Joi.string().required(),
  }),
};
