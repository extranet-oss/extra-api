const assert = require('assert');
const app = require('../../src/app');

describe('\'locations-countries\' service', () => {
  it('registered the service', () => {
    const service = app.service('locations/countries');

    assert.ok(service, 'Registered the service');
  });
});
