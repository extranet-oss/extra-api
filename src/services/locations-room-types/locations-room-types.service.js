// Initializes the `locations-room-types` service on path `/locations/room-types`
const createService = require('feathers-sequelize');
const createModel = require('../../models/locations-room-types.model');
const hooks = require('./locations-room-types.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'locations-room-types',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/locations/room-types', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('locations/room-types');

  service.hooks(hooks);
};
