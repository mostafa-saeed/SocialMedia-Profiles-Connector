const {
  describe, it, before, after,
} = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { start, stop } = require('../../src/server');
const Platforms = require('../../src/models/platforms');
const { getPlatforms, getPlatform } = require('../../src/services/platforms');

const { assert, expect } = chai;
chai.use(chaiAsPromised);

let server;
const platform = {
  name: 'facebook',
  profileURL: 'https://fb.com',
  usernamePattern: '^[a-z\\d.]{5,}$',
};

describe('Platforms Service', () => {
  before(async () => {
    server = await start();
    await Platforms.deleteMany();
    await Platforms.create(platform);
  });

  after(async () => {
    await Platforms.deleteMany();
    await stop(server);
  });

  describe('getPlatforms function', () => {
    it('Should return an array of the available platforms', async () => {
      const platforms = await getPlatforms();
      assert.isArray(platforms);
    });
  });

  describe('getPlatform function', () => {
    it('Should return platform by its name', async () => {
      const result = await getPlatform({
        params: { platform: platform.name },
      });
      assert.isObject(result);
      assert.property(result, 'name');
    });

    it('Should throw an exception with a wrong name', async () => {
      await expect(getPlatform({
        params: { platform: 'NOT_FOUND' },
      })).to.be.rejectedWith('Platform doesn\'t exist');
    });
  });
});
