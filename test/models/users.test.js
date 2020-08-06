const {
  describe, it, before, after,
} = require('mocha');
const chaiAsPromised = require('chai-as-promised');
const chai = require('chai');
const { connect, disconnect } = require('mongoose');
const Users = require('../../src/models/users');

const { assert, expect } = chai;
const { DB_CONNECTION_STRING } = require('../../config.js');

const newUser = {
  username: 'mostafa',
  email: 'mostafa.saeed543@gmail.com',
  password: '123',
};

chai.use(chaiAsPromised);

before(async () => {
  // Connect to database
  await connect(DB_CONNECTION_STRING);
  // Clear database
  await Users.remove();
});

after(async () => {
  await disconnect();
});

describe('Users Model', () => {
  describe('Creating new user', () => {
    it('Should reject empty user object', async () => {
      expect(new Users().save()).to.eventually.throw();
    });
    it('Should create new user', async () => {
      const user = await new Users(newUser).save();
      assert.property(user, '_id', 'Created user must have _id');
      assert.equal(user.username, newUser.username);
    });
    it('Should reject duplicate email/username', async () => {
      expect(new Users().save(newUser)).to.eventually.throw();
    });
  });
  describe('Getting users', () => {
    it('Should get single user', async () => {
      const user = await Users.findOne(newUser);
      assert.isObject(user);
      assert.property(user, '_id');
      assert.equal(user.username, newUser.username);
    });
    it('Should get all users', async () => {
      const users = await Users.find();
      assert.isArray(users, 'It should return an array of users');
      assert.equal(users.length, 1, 'The array should have one user');
    });
    it('Should return null for non-existing users', async () => {
      const notFound = await Users.findOne({
        username: 'NOT_FOUND',
      });
      assert.isNull(notFound);
    });
  });
  describe('Updating users', () => {
    it('Should update single user by id', async () => {
      const newUsername = 'mostafa.saeed';
      const updated = await Users.findOneAndUpdate(newUser, {
        username: newUsername,
      }, {
        new: true,
      });
      assert.equal(updated.username, newUsername, 'Username should be updated');
    });

    it('Should update all users', async () => {
      const newPassword = '1234';
      await Users.updateMany({}, {
        password: newPassword,
      });

      const user = await Users.findOne({
        email: newUser.email,
      });

      assert.equal(user.password, newPassword, 'Now all users passwords should be 1234 🙄🙄');
    });
  });
  describe('Deleting users', () => {
    // Add multiple users
    before(async () => {
      await Promise.all(Array(3).fill(0).map((value, index) => new Users({
        username: `username${index}`,
        email: `email${index}@localhost`,
        password: '123',
      }).save()));
    });

    it('Should delete single user', async () => {
      await Users.deleteOne({
        email: newUser.email,
      });
      const user = await Users.findOne({
        email: newUser.email,
      });
      assert.isNull(user);
    });

    it('Should delete all users', async () => {
      await Users.deleteMany();
      const users = await Users.find();
      assert.isArray(users);
      assert.equal(users.length, 0, 'We shouldn\'t have any users');
    });
  });
});
