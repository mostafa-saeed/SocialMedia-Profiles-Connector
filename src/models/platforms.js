const { Schema, model } = require('mongoose');

const platformSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  profileURL: {
    type: String,
    required: true,
  },
  usernamePattern: {
    type: String,
    required: true,
  },
});

module.exports = model('Platforms', platformSchema);
