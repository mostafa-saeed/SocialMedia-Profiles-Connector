const {
  describe, it, before, after,
} = require('mocha');
const chaiAsPromised = require('chai-as-promised');
const chai = require('chai');

const { assert } = chai;
const { expect } = require('chai');
const { start, stop } = require('../../src/server');
const Users = require('../../src/models/users');
const Platforms = require('../../src/models/platforms');
const UserPlatforms = require('../../src/models/userPlatforms');
const { getUserPlatform, validateUsername, addUserPlatform } = require('../../src/services/userPlatforms');

chai.use(chaiAsPromised);

let server;
let user;
let platform;
const username = 'testing';
const invalidUsername = '1234';

const userObject = {
  email: 'test@localhost',
  username: 'testing',
  password: '1234',
};

const platformObject = {
  name: 'facebook',
  profileURL: 'https://fb.com',
  usernamePattern: '^[a-z\\d.]{5,}$',
};

describe('UserPlatforms Service', () => {
  before(async () => {
    server = await start();
    await Users.deleteMany({});
    await Platforms.deleteMany({});
    await UserPlatforms.deleteMany({});

    user = await Users.create(userObject);
    platform = await Platforms.create(platformObject);
  });

  after(async () => {
    await Users.deleteMany({});
    await Platforms.deleteMany({});
    await UserPlatforms.deleteMany({});
    stop(server);
  });

  // getUserPlatform
  describe('getUserPlatform function', () => {
    before(async () => {
      const { _id: userID } = user;
      const { _id: platformID } = platform;
      await UserPlatforms.create({
        user: userID,
        platform: platformID,
        username,
      });
    });

    after(async () => {
      await UserPlatforms.deleteMany();
    });

    it('Should return userPlatform', async () => {
      const { _id: userID } = user;
      const { _id: platformID, profileURL } = platform;

      const result = await getUserPlatform({
        pre: { user: { id: userID }, platform: { id: platformID, profileURL } },
        params: { username },
      });

      assert.isObject(result);
      assert.property(result, 'id');
      assert.property(result, 'username');
      assert.property(result, 'url');
      assert.equal(result.username, username);
    });

    it('Should throw an exception when userPlatform isn\'t found', async () => {
      const { _id: userID } = user;
      const { _id: platformID } = platform;
      const invalidPlatformID = platformID.toString().replace('1', '0');
      await expect(getUserPlatform({
        pre: { user: { id: userID }, platform: { id: invalidPlatformID } },
      })).to.be.rejectedWith('UserPlatform doesn\'t exist');
    });
  });

  describe('validateUsername function', () => {
    it('Should return true when a valid username is passed', async () => {
      const result = validateUsername({
        pre: { platform },
        payload: { username },
      });
      assert.isTrue(result);
    });

    it('Should throw an error when the username doesn\'t match the platform pattern', async () => {
      expect(() => {
        validateUsername({
          pre: { platform },
          payload: { username: invalidUsername },
        });
      }).to.throw('Invalid username');
    });
  });

  describe('addUserPlatform function', () => {
    it('Should add a userPlatform', async () => {
      const userPlatform = await addUserPlatform({
        pre: { platform },
        auth: { credentials: { user } },
        payload: { username },
      });

      assert.isObject(userPlatform);
      assert.property(userPlatform, 'id');
      assert.property(userPlatform, 'username');
      assert.property(userPlatform, 'url');
    });
  });
});
