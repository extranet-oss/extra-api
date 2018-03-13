// Initializes the `pictures` service on path `/pictures`
const createService = require('feathers-sequelize');
const createModel = require('../../models/pictures.model');
const hooks = require('./pictures.hooks');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'pictures',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/pictures', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('pictures');

  service.hooks(hooks);
};
