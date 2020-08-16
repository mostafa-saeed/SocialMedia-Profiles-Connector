const { describe, it } = require('mocha');
const { assert } = require('chai');
const { start, stop } = require('../src/server');

describe('Server', () => {
  it('Should start without errors', async () => {
    const result = await start();
    assert.isTrue(result);
  });

  it('Should stop the server', async () => {
    const result = await stop();
    assert.isTrue(result);
  });
});
