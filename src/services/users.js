const {
  badRequest, notFound, forbidden, unauthorized,
} = require('@hapi/boom');
const Users = require('../models/users');
const { hashPassword, comparePassword } = require('./auth');

const userProjection = {
  __v: 0,
  password: 0,
};

const userResponse = ({ _id: id, username, email }) => ({
  id, username, email,
});

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
    const user = await Users.create(req.payload);
    return userResponse(user);
  },

  getUser: async (req) => {
    const { username } = req.params;
    const user = await Users.findOne({ username }, userProjection);
    if (!user) {
      throw notFound('User doesn\'t exist!');
    }

    return userResponse(user);
  },

  usernameEmailLogin: async (req) => {
    const { login } = req.payload;
    const user = await Users.findOne({
      $or: [{ username: login }, { email: login }],
    });

    if (!user) throw unauthorized('Wrong email/username or password');

    return {
      user: userResponse(user),
      hashedPassword: user.password,
    };
  },

  loginComparePassword: async (req) => {
    const { password } = req.payload;
    const { pre: { result: { hashedPassword } } } = req;

    const result = await comparePassword(password, hashedPassword);
    if (!result) throw unauthorized('Wrong email/username or password');

    return result;
  },

  canUpdate: async (req) => {
    const { username } = req.auth.credentials.user;
    if (username !== req.params.username) {
      throw forbidden('Can\'t edit');
    }

    return true;
  },

};
