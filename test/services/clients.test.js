const assert = require('assert');
const app = require('../../src/app');

describe('\'clients\' service', () => {
  it('registered the service', () => {
    const service = app.service('clients');

    assert.ok(service, 'Registered the service');
  });
});
