// Initializes the `oauth-authorizations` service on path `/oauth/authorizations`
const createService = require('feathers-sequelize');
const createModel = require('../../models/oauth-authorizations.model');
const hooks = require('./oauth-authorizations.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'oauth-authorizations',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/oauth/authorizations', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('oauth/authorizations');

  service.hooks(hooks);
};
