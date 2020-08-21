const { register, login } = require('../schemas/users');
const {
  getUser, emailAvailable, usernameAvailable, hashPassword, createUser,
  usernameEmailLogin, loginComparePassword,
} = require('../services/users');
const { generateToken } = require('../services/auth');

module.exports = [{
  method: 'get',
  path: '/api/users/{username}',
  config: {
    pre: [
      { method: getUser, assign: 'user' },
    ],
    handler: ({ pre: { user } }) => user,
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
      { method: createUser, assign: 'user' },
    ],
    validate: { payload: register },
    handler: ({ pre: { user } }) => ({
      user,
      token: generateToken(user),
    }),
  },
},

{
  method: 'post',
  path: '/api/users/login',
  config: {
    pre: [
      { method: usernameEmailLogin, assign: 'result' },
      { method: loginComparePassword },
    ],
    validate: { payload: login },
    handler: ({ pre: { result: { user } } }) => ({
      user,
      token: generateToken(user),
    }),
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
