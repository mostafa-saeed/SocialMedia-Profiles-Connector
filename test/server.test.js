const { describe, it } = require('mocha');
const { assert } = require('chai');
const { start, stop } = require('../src/server');

describe('Server', () => {
  let server;
  it('Should start without errors', async () => {
    server = await start();
    assert.isObject(server);
  });

  it('Should stop the server', async () => {
    const result = await stop(server);
    assert.isTrue(result);
  });
});
