// Initializes the `locations-buildings` service on path `/locations/buildings`
const createService = require('feathers-sequelize');
const createModel = require('../../models/locations-buildings.model');
const hooks = require('./locations-buildings.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'locations-buildings',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/locations/buildings', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('locations/buildings');

  service.hooks(hooks);
};
