const assert = require('assert');
const app = require('../../src/app');

describe('\'locations-buildings\' service', () => {
  it('registered the service', () => {
    const service = app.service('locations/buildings');

    assert.ok(service, 'Registered the service');
  });
});
