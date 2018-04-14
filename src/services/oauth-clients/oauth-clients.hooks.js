const { authenticate } = require('../../hooks/authentication');
const jsonifyFields = require('../../hooks/jsonify-fields');

const showOnlyListedTrueEntries = require('../../hooks/show-only-listed-true-entries');

module.exports = {
  before: {
    all: [ authenticate('both'), jsonifyFields(['redirect_uris', 'required_permissions']) ],
    find: [showOnlyListedTrueEntries()],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [ jsonifyFields(['redirect_uris', 'required_permissions']) ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
