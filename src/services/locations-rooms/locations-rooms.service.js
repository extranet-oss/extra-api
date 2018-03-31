// Initializes the `locations-rooms` service on path `/locations/rooms`
const createService = require('feathers-sequelize');
const createModel = require('../../models/locations-rooms.model');
const hooks = require('./locations-rooms.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'locations-rooms',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/locations/rooms', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('locations/rooms');

  service.hooks(hooks);
};
