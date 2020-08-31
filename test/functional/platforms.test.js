const {
  describe, it, before, after,
} = require('mocha');
const { assert } = require('chai');
const Platforms = require('../../src/models/platforms');
const { start, stop } = require('../../src/server');

const platform = {
  name: 'facebook',
  profileURL: 'https://fb.com',
  usernamePattern: '^[a-z\\d.]{5,}$',
};

let server;

describe('Platform API Functional Testing', () => {
  before(async () => {
    server = await start();
    await Platforms.deleteMany();
    await Platforms.create(platform);
  });

  after(async () => {
    await Platforms.deleteMany();
    await stop(server);
  });

  describe('GET /api/platforms', () => {
    it('Should return 200 status code and an array of platforms', async () => {
      const { statusCode, result } = await server.inject({
        method: 'GET',
        url: '/api/platforms',
      });

      assert.strictEqual(statusCode, 200);
      assert.isArray(result);
      assert.strictEqual(result.length, 1);
    });
  });
});
