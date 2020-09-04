const Joi = require('joi');

const platformResponse = Joi.object({
  id: Joi.string().example('5f509cdf9532620edf41fd1b'),
  name: Joi.string().example('facebook'),
  profileURL: Joi.string().uri().example('https://fb.com'),
  usernamePattern: Joi.string().example('^[a-z\\d.]{5,}$'),
}).label('PlatformResponse');

module.exports = {
  platformsResponse: Joi.array().items(platformResponse).label('PlatformsResponse'),
};
