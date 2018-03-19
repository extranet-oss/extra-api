const { authenticate } = require('@feathersjs/authentication').hooks;
const jsonifyFields = require('../../hooks/jsonify-fields');

module.exports = {
  before: {
    all: [ authenticate('jwt'), jsonifyFields(['redirect_uris', 'required_permissions']) ],
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
