const assert = require('assert');
const app = require('../../src/app');

describe('\'locations-rooms\' service', () => {
  it('registered the service', () => {
    const service = app.service('locations/rooms');

    assert.ok(service, 'Registered the service');
  });
});
