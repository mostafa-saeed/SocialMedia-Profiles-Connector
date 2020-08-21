const jwt = require('jsonwebtoken');
const { hash, compare } = require('bcrypt');
const Users = require('../models/users');
const { JWT_TOKEN } = require('../config');

module.exports = {

  hashPassword: (password) => hash(password, 10),

  comparePassword: (plainPassword, hashedPassword) => compare(plainPassword, hashedPassword),

  generateToken: (user) => jwt.sign({
    user,
  }, JWT_TOKEN),

  validateToken: async ({ user: { username } }) => ({
    isValid: await Users.findOne({ username }),
  }),

};
