const assert = require('assert');
const app = require('../../src/app');

describe('\'oauth-authorization-codes\' service', () => {
  it('registered the service', () => {
    const service = app.service('oath/authorization-codes');

    assert.ok(service, 'Registered the service');
  });
});
