const { register } = require('../schemas/users');
const {
  userExists, emailAvailable, usernameAvailable, hashPassword, createUser,
} = require('../services/users');
const { generateToken } = require('../services/auth');

module.exports = [
  {
    method: 'get',
    path: '/api/users/{username}',
    config: {
      pre: [
        { method: userExists },
      ],
      handler: ({ foundUser }) => foundUser,
    },
  },

  {
    method: 'post',
    path: '/api/users',
    config: {
      pre: [
        { method: emailAvailable },
        { method: usernameAvailable },
        { method: hashPassword },
        { method: createUser },
      ],
      validate: { payload: register },
      handler: (req) => {
        const { createdUser: user } = req;
        return {
          user,
          token: generateToken(user),
        };
      },
    },
  },
];
