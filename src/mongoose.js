const mongoose = require('mongoose');

require('mongoose-type-email');
require('mongoose-type-url');

module.exports = function (app) {
  mongoose.connect(app.get('mongodb'), {});
  mongoose.Promise = global.Promise;

  app.set('mongooseClient', mongoose);
};
