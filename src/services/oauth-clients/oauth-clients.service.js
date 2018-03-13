// Initializes the `oauth-clients` service on path `/oauth/clients`
const createService = require('feathers-sequelize');
const createModel = require('../../models/oauth-clients.model');
const hooks = require('./oauth-clients.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'oauth-clients',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/oauth/clients', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('oauth/clients');

  service.hooks(hooks);
};
