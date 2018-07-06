const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const hideMongooseInternals = require('../../src/hooks/hide-mongoose-internals');

describe('\'hide_mongoose_internals\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      after: hideMongooseInternals()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
