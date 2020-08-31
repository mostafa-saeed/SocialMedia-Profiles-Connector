const {
  describe, it, before, after,
} = require('mocha');
const { assert } = require('chai');
const Users = require('../../src/models/users');
const Platforms = require('../../src/models/platforms');
const UserPlatforms = require('../../src/models/userPlatforms');
const { start, stop } = require('../../src/server');

const userObject = {
  username: 'testing',
  email: 'test@gmail.com',
  password: '12345678',
};

const platformObject = {
  name: 'facebook',
  profileURL: 'https://fb.com',
  usernamePattern: '^[a-z\\d.]{5,}$',
};

const anotherPlatformObject = {
  name: 'notFacebook',
  profileURL: 'https://fb.com',
  usernamePattern: '^[a-z\\d.]{5,}$',
};

const username = 'testing';

let server;
let user;
let platform;
let anotherPlatform;
let jwtToken;

describe('UserPlatforms API Functional Testing', () => {
  before(async () => {
    server = await start();
    await UserPlatforms.deleteMany();
    const { result } = await server.inject({
      method: 'POST',
      url: '/api/users',
      payload: userObject,
    });
    user = result.user;
    jwtToken = result.token;
    platform = await Platforms.create(platformObject);
    anotherPlatform = await Platforms.create(anotherPlatformObject);
  });

  after(async () => {
    await Users.deleteMany();
    await Platforms.deleteMany();
    await UserPlatforms.deleteMany();
    await stop(server);
  });

  describe('POST /api/users/platforms/{platform}', () => {
    it('Should return 400 when an invalid username is passed', async () => {
      const invalidUsername = '123';

      const { statusCode, result: { message } } = await server.inject({
        method: 'POST',
        url: `/api/users/platforms/${platform.name}`,
        headers: { Authorization: jwtToken },
        payload: { username: invalidUsername },
      });

      assert.strictEqual(statusCode, 400);
      assert.strictEqual(message, 'Invalid username');
    });

    it('Should userPlatform when the username matches the patter', async () => {
      const { statusCode, result } = await server.inject({
        method: 'POST',
        url: `/api/users/platforms/${platform.name}`,
        headers: { Authorization: jwtToken },
        payload: { username },
      });

      assert.strictEqual(statusCode, 200);
      assert.isObject(result);
    });
  });

  describe('GET /api/users/{username}/{platform}', () => {
    it('Should return 404 when a user doesn\'t have the platform', async () => {
      const { statusCode, result: { message } } = await server.inject({
        method: 'GET',
        url: `/api/users/${user.username}/${anotherPlatform.name}`,
      });

      assert.strictEqual(statusCode, 404);
      assert.strictEqual(message, 'UserPlatform doesn\'t exist');
    });

    it('Should return 200 when the userPlatform exists', async () => {
      const { statusCode, result } = await server.inject({
        method: 'GET',
        url: `/api/users/${user.username}/${platform.name}`,
      });

      assert.strictEqual(statusCode, 200);
      assert.isObject(result);
      assert.strictEqual(result.url, 'https://fb.com/testing');
    });
  });
});
