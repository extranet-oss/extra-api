const { authenticate } = require('../../hooks/authentication');
const jsonifyFields = require('../../hooks/jsonify-fields');

module.exports = {
  before: {
    all: [ authenticate('both'),  jsonifyFields('scopes')  ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [ jsonifyFields('scopes') ],
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
