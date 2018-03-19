const { authenticate } = require('@feathersjs/authentication').hooks;
const jsonifyFields = require('../../hooks/jsonify-fields');

module.exports = {
  before: {
    all: [ authenticate('jwt'), jsonifyFields('permissions') ],
    find: [  ],
    get: [  ],
    create: [  ],
    update: [  ],
    patch: [  ],
    remove: [  ]
  },

  after: {
    all: [ jsonifyFields('permissions') ],
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
