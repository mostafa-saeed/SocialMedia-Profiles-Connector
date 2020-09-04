const {
  badRequest, notFound, unauthorized,
} = require('@hapi/boom');
const Users = require('../models/users');
const { hashPassword, comparePassword } = require('./auth');

const userProjection = {
  __v: 0,
  password: 0,
};

const userPlatformsResponse = (userPlatforms) => userPlatforms.map(({ username, platform }) => ({
  username,
  name: platform.name,
  url: `${platform.profileURL}/${username}`,
}));

const userResponse = ({
  _id: id, username, email, platforms,
}) => ({
  id: id.toString(),
  username,
  email,
  platforms: userPlatformsResponse(platforms || []),
});

const USER_PLATFORMS_POPULATE_OBJECT = {
  path: 'platforms',
  populate: {
    path: 'platform',
    model: 'Platforms',
  },
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
    const user = await Users.create(req.payload);
    return userResponse(user);
  },

  getUser: async (req) => {
    const { username } = req.params;
    const user = await Users.findOne({ username }, userProjection).populate(
      USER_PLATFORMS_POPULATE_OBJECT,
    );

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

};
