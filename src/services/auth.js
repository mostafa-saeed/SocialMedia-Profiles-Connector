const jwt = require('jsonwebtoken');
const { hash, compare } = require('bcrypt');
const Users = require('../models/users');
const { JWT_TOKEN } = require('../config');

module.exports = {

  hashPassword: (password) => hash(password, 10),

  comparePassword: (plainPassword, hashedPassword) => compare(plainPassword, hashedPassword),

  generateToken: ({ username, email }) => jwt.sign({
    user: { username, email },
  }, JWT_TOKEN),

  validateToken: async (decoded) => ({
    isValid: await Users.findOne({ username: decoded.username }),
  }),

};
