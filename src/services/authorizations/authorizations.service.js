// Initializes the `authorizations` service on path `/authorizations`
const createService = require('feathers-mongoose');
const createModel = require('../../models/authorizations.model');
const hooks = require('./authorizations.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/authorizations', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('authorizations');

  service.hooks(hooks);
};
