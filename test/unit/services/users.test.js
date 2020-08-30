const {
  describe, it, before, after,
} = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Users = require('../../../src/models/users');
const { start, stop } = require('../../../src/server');
const {
  emailAvailable, usernameAvailable, getUser, usernameEmailLogin,
} = require('../../../src/services/users');

const { assert, expect } = chai;
chai.use(chaiAsPromised);
let server;

describe('Users Service', () => {
  const notFoundEmail = 'notfound@localhost';
  const notFoundUsername = 'notfound';
  const user = {
    email: 'test@localhost',
    username: 'testing',
    password: '1234',
  };

  before(async () => {
    server = await start();
    await Users.deleteMany();
    await Users.create(user);
  });

  after(async () => {
    await Users.deleteMany();
    await stop(server);
  });

  describe('emailAvailable function', () => {
    it('Should return true when no users found with the same email', async () => {
      const result = await emailAvailable({
        payload: { email: notFoundEmail },
      });
      assert.isTrue(result);
    });

    it('Should throw an error when a user with the same email already exists', async () => {
      await expect(emailAvailable({
        payload: { email: user.email },
      })).to.be.rejectedWith('Email already exists!');
    });
  });

  describe('usernameAvailable function', () => {
    it('Should return true when no users found with the same username', async () => {
      const result = await usernameAvailable({
        payload: { username: notFoundUsername },
      });
      assert.isTrue(result);
    });

    it('Should throw an error when a user with the same username already exists', async () => {
      await expect(usernameAvailable({
        payload: { username: user.username },
      })).to.be.rejectedWith('Username already exists!');
    });
  });

  describe('getUser function', () => {
    it('Should return the user by username', async () => {
      const result = await getUser({
        params: { username: user.username },
      });
      assert.isObject(result);
    });

    it('Should throw an error when the isn\'t found', async () => {
      await expect(getUser({
        params: { username: notFoundUsername },
      })).to.be.rejectedWith('User doesn\'t exist!');
    });
  });

  describe('usernameEmailLogin function', () => {
    it('Should return the user by username', async () => {
      const { user: result } = await usernameEmailLogin({
        payload: { login: user.username },
      });
      assert.isObject(result);
      assert.property(result, 'id');
      assert.property(result, 'username');
      assert.property(result, 'email');
      assert.notProperty(result, 'password');
    });

    it('Should return the user by email', async () => {
      const { user: result } = await usernameEmailLogin({
        payload: { login: user.email },
      });
      assert.isObject(result);
      assert.property(result, 'id');
      assert.property(result, 'username');
      assert.property(result, 'email');
      assert.notProperty(result, 'password');
    });

    it('Should throw an error when no user is found', async () => {
      await expect(usernameEmailLogin({
        payload: { login: notFoundUsername },
      })).to.be.rejectedWith('Wrong email/username or password');
    });
  });
});
