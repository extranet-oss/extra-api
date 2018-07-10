const authentication = require('@feathersjs/authentication');
const hideMongooseInternals = require('../../hooks/hide-mongoose-internals');

module.exports = {
  before: {
    all: [
      authentication.hooks.authenticate('jwt'),
      hideMongooseInternals()
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [hideMongooseInternals()],
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
