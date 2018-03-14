// Initializes the `oauth-authorization-codes` service on path `/oauth/authorization-codes`
const merge = require('lodash.merge');
const createService = require('./oauth-authorization-codes.class.js');
const hooks = require('./oauth-authorization-codes.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = merge({
    name: 'oauth-authorization-codes',
    paginate
  }, app.get('oauth'));

  // Initialize our service with any options it requires
  app.use('/oauth/authorization-codes', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('oauth/authorization-codes');

  service.hooks(hooks);
};
