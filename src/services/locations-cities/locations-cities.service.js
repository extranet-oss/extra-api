// Initializes the `locations-cities` service on path `/locations/cities`
const createService = require('feathers-sequelize');
const createModel = require('../../models/locations-cities.model');
const hooks = require('./locations-cities.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'locations-cities',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/locations/cities', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('locations/cities');

  service.hooks(hooks);
};
