const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const showOnlyListedTrueEntries = require('../../src/hooks/show-only-listed-true-entries');

describe('\'show only listed=true entries\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      before: showOnlyListedTrueEntries()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
