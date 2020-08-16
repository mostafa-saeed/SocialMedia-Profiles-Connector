const {
  describe, it, before,
} = require('mocha');
const { assert } = require('chai');
const { hashPassword, comparePassword, generateToken } = require('../../src/services/auth');

describe('Auth Server', () => {
  describe('Password functions', () => {
    describe('hashPassword', () => {
      it('Should generate hash for a given string', async () => {
        const password = '1234';
        const hash = await hashPassword(password);
        assert.notEqual(password, hash);
      });
    });

    describe('comparePassword: Should return whether a string matches a given hash', () => {
      const password = '1234';
      const invalidPassword = '123';
      let hash;

      before(async () => {
        hash = await hashPassword(password);
      });

      it('Should return true when the string matches the hash', async () => {
        const result = await comparePassword(password, hash);
        assert.isTrue(result);
      });

      it('Should return false when the string is invalid', async () => {
        const result = await comparePassword(invalidPassword, hash);
        assert.isFalse(result);
      });
    });
  });

  describe('Token functions', () => {
    it('generateToken: Should return a JWT token', async () => {
      const token = await generateToken({
        username: 'mostafa',
        email: 'test@localhost',
        password: 's0mER@andom__Characters',
      });

      assert.isString(token);
      assert.isNotEmpty(token);
    });
  });
});
