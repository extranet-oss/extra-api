

const hideMongooseInternals = require('../../hooks/hide-mongoose-internals');

module.exports = {
  before: {
    all: [hideMongooseInternals()],
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
