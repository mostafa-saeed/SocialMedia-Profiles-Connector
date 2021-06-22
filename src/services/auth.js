const jwt = require('jsonwebtoken');
const { hash, compare } = require('bcrypt');
const Users = require('../models/users');
const { JWT_TOKEN } = require('../config');

module.exports = {

  hashPassword: (password) => hash(password, 10),

  comparePassword: (plainPassword, hashedPassword) => compare(plainPassword, hashedPassword),

  generateToken: ({ id, email, username }) => jwt.sign({
    user: { id, email, username },
  }, JWT_TOKEN),

  validateToken: async ({ user: { id } }) => ({
    isValid: await Users.findOne({ _id: id }),
  }),

};
