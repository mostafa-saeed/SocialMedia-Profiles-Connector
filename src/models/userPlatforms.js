const { Schema, model } = require('mongoose');

const userPlatformSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  },
  platform: {
    type: Schema.Types.ObjectId,
    ref: 'Platforms',
  },
  username: {
    type: String,
    required: true,
  },
});

module.exports = model('UserPlatforms', userPlatformSchema);
