const { authenticate } = require('@feathersjs/authentication').hooks;
const { alterItems } = require('feathers-hooks-common');


const auth = authenticate('jwt');

module.exports = {
  before: {
    all: [ auth ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      alterItems(rec => {
        delete rec.id;
        rec.id = rec.uuid;
        delete rec.uuid;
      })
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
