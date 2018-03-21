const { authenticate } = require('../../hooks/authentication');
const jsonifyFields = require('../../hooks/jsonify-fields');

module.exports = {
  before: {
    all: [ authenticate('both'), jsonifyFields('permissions') ],
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
