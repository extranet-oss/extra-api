const { authenticate } = require('@feathersjs/authentication').hooks;


const auth = authenticate('jwt');

module.exports = {
  before: {
    all: [ auth ],
    find: [  ],
    get: [  ],
    create: [  ],
    update: [  ],
    patch: [  ],
    remove: [  ]
  },

  after: {
    all: [],
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
