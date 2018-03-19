const assert = require('assert');
const app = require('../../src/app');

describe('\'oauth-authorizations\' service', () => {
  it('registered the service', () => {
    const service = app.service('oauth/authorizations');

    assert.ok(service, 'Registered the service');
  });
});
