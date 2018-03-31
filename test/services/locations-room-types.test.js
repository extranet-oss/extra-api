const assert = require('assert');
const app = require('../../src/app');

describe('\'locations-room-types\' service', () => {
  it('registered the service', () => {
    const service = app.service('locations/room-types');

    assert.ok(service, 'Registered the service');
  });
});
