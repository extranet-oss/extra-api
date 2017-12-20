const { authenticate } = require('feathers-authentication').hooks;
const commonHooks = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');


const auth = authenticate('jwt');
const restrict = [
  auth,
  restrictToOwner({
    idField: 'uuid',
    ownerField: 'uuid'
  })
];

module.exports = {
  before: {
    all: [],
    find: [ auth ],
    get: [ ...restrict ],
    create: [  ],
    update: [ ...restrict ],
    patch: [ ...restrict ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
      commonHooks.when(
        hook => hook.params.provider,
        commonHooks.discard('password')
      )
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
