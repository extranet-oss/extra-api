const assert = require('assert');
const app = require('../../src/app');

describe('\'locations-cities\' service', () => {
  it('registered the service', () => {
    const service = app.service('locations/cities');

    assert.ok(service, 'Registered the service');
  });
});
