const assert = require('assert');
const app = require('../../src/app');

describe('\'oauth-clients\' service', () => {
  it('registered the service', () => {
    const service = app.service('oauth/clients');

    assert.ok(service, 'Registered the service');
  });
});
