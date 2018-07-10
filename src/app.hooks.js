// Application hooks that run for every service
const log = require('./hooks/log');
const authentication = require('@feathersjs/authentication');

module.exports = {
  before: {
    all: [ log(), authentication.hooks.authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [ log() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ log() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
