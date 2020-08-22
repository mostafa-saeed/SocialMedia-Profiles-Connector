const { notFound } = require('@hapi/boom');
const Platforms = require('../models/platforms');

const platformProjection = {
  __v: 0,
};

const platformResponse = ({
  _id: id, name, profileURL, usernamePattern,
}) => ({
  id, name, profileURL, usernamePattern,
});

module.exports = {
  getPlatforms: async () => (
    await Platforms.find({}, platformProjection)
  ).map((platform) => platformResponse(platform)),

  getPlatform: async (req) => {
    const { platform: name } = req.params;
    const platform = await Platforms.findOne({ name }, platformProjection);
    if (!platform) throw notFound('Platform doesn\'t exist');

    return platformResponse(platform);
  },

};
