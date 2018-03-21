const { authenticate } = require('../../hooks/authentication');
const jsonifyFields = require('../../hooks/jsonify-fields');

module.exports = {
  before: {
    all: [ authenticate('both'), jsonifyFields(['redirect_uris', 'required_permissions']) ],
    find: [],
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
