const assert = require('assert');
const app = require('../../src/app');

describe('\'authorizations\' service', () => {
  it('registered the service', () => {
    const service = app.service('authorizations');

    assert.ok(service, 'Registered the service');
  });
});
