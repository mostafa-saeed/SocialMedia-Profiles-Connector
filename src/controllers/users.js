const { register, login } = require('../schemas/users');
const {
  userExists, emailAvailable, usernameAvailable, hashPassword, createUser,
  usernameEmailLogin, loginComparePassword,
} = require('../services/users');
const { generateToken } = require('../services/auth');

module.exports = [{
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

{
  method: 'post',
  path: '/api/users/login',
  config: {
    pre: [
      { method: usernameEmailLogin },
      { method: loginComparePassword },
    ],
    validate: { payload: login },
    handler: (req) => {
      const { foundUser: user } = req;
      return {
        user,
        token: generateToken(user),
      };
    },
  },
},

{
  method: 'get',
  path: '/api/users/me',
  config: {
    auth: { strategy: 'jwt' },
    handler: (req) => req.auth.credentials.user,
  },
}];
