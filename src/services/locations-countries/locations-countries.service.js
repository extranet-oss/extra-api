// Initializes the `locations-countries` service on path `/locations/countries`
const createService = require('feathers-sequelize');
const createModel = require('../../models/locations-countries.model');
const hooks = require('./locations-countries.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'locations-countries',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/locations/countries', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('locations/countries');

  service.hooks(hooks);
};
