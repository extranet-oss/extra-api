const { authenticate } = require('@feathersjs/authentication').hooks;
const hideMongooseInternals = require('../../hooks/hide-mongoose-internals');
const ObjectID64 = require('../../hooks/object-id-64');

module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      hideMongooseInternals(),
      ObjectID64()
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      ObjectID64(),
      hideMongooseInternals()
    ],
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
