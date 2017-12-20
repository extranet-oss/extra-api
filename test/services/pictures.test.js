const assert = require('assert');
const app = require('../../src/app');

describe('\'pictures\' service', () => {
  it('registered the service', () => {
    const service = app.service('pictures');

    assert.ok(service, 'Registered the service');
  });
});
