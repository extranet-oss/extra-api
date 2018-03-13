const users = require('./users/users.service.js');
const pictures = require('./pictures/pictures.service.js');
const oauthClients = require('./oauth-clients/oauth-clients.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(pictures);
  app.configure(oauthClients);
};
