const {
  describe, it, before, after,
} = require('mocha');
const { assert } = require('chai');
const Users = require('../../src/models/users');
const { start, stop } = require('../../src/server');

let server;

const registrationPayload = {
  username: 'testing',
  email: 'test@gmail.com',
  password: '12345678',
};

const loginPayload = {
  login: 'test@gmail.com',
  password: '12345678',
};

let jwtToken;

describe('Users API Functional Testing', () => {
  before(async () => {
    server = await start();
    await Users.deleteMany();
  });

  after(async () => {
    await Users.deleteMany();
    await stop(server);
  });

  describe('POST /api/users (Registration)', () => {
    it('Should return 200 status code, created user and the JWT token', async () => {
      const { statusCode, result } = await server.inject({
        method: 'POST',
        url: '/api/users',
        payload: registrationPayload,
      });

      assert.strictEqual(statusCode, 200);
      assert.isObject(result);
      assert.isString(result.token);
      assert.isObject(result.user);
    });
  });

  describe('POST /api/users/login', () => {
    it('Should return 200 status code, user and the JWT token', async () => {
      const { statusCode, result } = await server.inject({
        method: 'POST',
        url: '/api/users/login',
        payload: loginPayload,
      });

      assert.strictEqual(statusCode, 200);
      assert.isObject(result);
      assert.isString(result.token);
      assert.isObject(result.user);

      jwtToken = result.token;
    });
  });

  describe('GET /api/users/{username}', () => {
    it('Should return 404 when user does not exist', async () => {
      const { statusCode } = await server.inject({
        method: 'GET',
        url: '/api/users/notFound',
      });

      assert.strictEqual(statusCode, 404);
    });

    it('Should return 200 when user exists', async () => {
      const { statusCode, result } = await server.inject({
        method: 'GET',
        url: `/api/users/${registrationPayload.username}`,
      });

      assert.strictEqual(statusCode, 200);
      assert.isObject(result);
    });
  });

  describe('GET /api/users/me', () => {
    it('Should return return logged in user', async () => {
      const { statusCode, result } = await server.inject({
        method: 'GET',
        url: '/api/users/me',
        headers: {
          Authorization: jwtToken,
        },
      });

      assert.strictEqual(statusCode, 200);
      assert.isObject(result);
    });

    it('Should return 401 when invalid token is used', async () => {
      const invalidToken = '123';
      const { statusCode } = await server.inject({
        method: 'GET',
        url: '/api/users/me',
        headers: {
          Authorization: invalidToken,
        },
      });

      assert.strictEqual(statusCode, 401);
    });
  });
});
