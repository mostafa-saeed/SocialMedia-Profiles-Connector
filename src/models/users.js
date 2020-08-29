const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });
userSchema.virtual('platforms', {
  ref: 'UserPlatforms',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

module.exports = model('Users', userSchema);
