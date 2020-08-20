const { notFound } = require('@hapi/boom');
const Platforms = require('../models/platforms');

const platformProjection = {
  _id: 0,
  __v: 0,
};

module.exports = {
  getPlatforms: () => Platforms.find({}, platformProjection),

  getPlatform: async (req) => {
    const { name } = req.params;
    const platform = await Platforms.findOne({ name });
    if (!platform) throw notFound('Platform doesn\'t exist');
    require.foundPlatform = platform;

    return platform;
  },

};
