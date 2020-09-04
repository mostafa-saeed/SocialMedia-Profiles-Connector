const {
  getUserSchema, registerSchema, loginSchema, userResponse, loginResponse,
} = require('../schemas/users');
const {
  getUser, emailAvailable, usernameAvailable, hashPassword, createUser,
  usernameEmailLogin, loginComparePassword,
} = require('../services/users');
const { generateToken } = require('../services/auth');

module.exports = [{
  method: 'get',
  path: '/api/users/{username}',
  config: {
    validate: getUserSchema,
    handler: getUser,
    response: { schema: userResponse },
    description: 'Get a user by username.',
    tags: ['api'],
  },
},

{
  method: 'post',
  path: '/api/users',
  config: {
    validate: registerSchema,
    pre: [
      { method: emailAvailable },
      { method: usernameAvailable },
      { method: hashPassword },
      { method: createUser, assign: 'user' },
    ],
    handler: ({ pre: { user } }) => ({
      user,
      token: generateToken(user),
    }),
    response: { schema: loginResponse },
    description: 'Add new user {Registration}.',
    tags: ['api'],
  },
},

{
  method: 'post',
  path: '/api/users/login',
  config: {
    validate: loginSchema,
    pre: [
      { method: usernameEmailLogin, assign: 'result' },
      { method: loginComparePassword },
    ],
    handler: ({ pre: { result: { user } } }) => ({
      user,
      token: generateToken(user),
    }),
    response: { schema: loginResponse },
    description: 'Login',
    tags: ['api'],
  },
},

{
  method: 'get',
  path: '/api/users/me',
  config: {
    auth: { strategy: 'jwt' },
    handler: (req) => req.auth.credentials.user,
    response: { schema: userResponse },
    description: 'Profile',
    tags: ['api'],
  },
}];
