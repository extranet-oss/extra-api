// Initializes the `clients` service on path `/clients`
const createService = require('feathers-mongoose');
const createModel = require('../../models/clients.model');
const hooks = require('./clients.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/clients', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('clients');

  service.hooks(hooks);
};
