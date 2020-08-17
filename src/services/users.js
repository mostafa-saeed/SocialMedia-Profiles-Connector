const { badRequest, notFound, forbidden } = require('@hapi/boom');
const Users = require('../models/users');
const { hashPassword } = require('./auth');

const userProjection = {
  _id: 0,
  __v: 0,
  password: 0,
};

module.exports = {
  emailAvailable: async (req) => {
    const { email } = req.payload;
    const found = await Users.findOne({ email });
    if (found) {
      throw badRequest('Email already exists!');
    }

    return true;
  },

  usernameAvailable: async (req) => {
    const { username } = req.payload;
    const found = await Users.findOne({ username });
    if (found) {
      throw badRequest('Username already exists!');
    }

    return true;
  },

  hashPassword: async (req) => {
    if (req.payload.password) {
      req.payload.password = await hashPassword(req.payload.password);
    }

    return req;
  },

  createUser: async (req) => {
    const { username, email } = await Users.create(req.payload);
    req.createdUser = {
      username, email,
    };

    return req.createdUser;
  },

  userExists: async (req) => {
    const { username } = req.params;
    const found = await Users.findOne({ username }, userProjection);
    if (!found) {
      throw notFound('User doesn\'t exist!');
    }
    req.foundUser = found;

    return found;
  },

  canUpdate: async (req) => {
    const { username } = req.auth.credentials.user;
    if (username !== req.params.username) {
      throw forbidden('Can\'t edit');
    }

    return true;
  },

};
