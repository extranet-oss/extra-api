const users = require('./users/users.service.js');
const pictures = require('./pictures/pictures.service.js');
const oauthClients = require('./oauth-clients/oauth-clients.service.js');
const oauthAuthorizationCodes = require('./oauth-authorization-codes/oauth-authorization-codes.service.js');
const oauthAuthorizations = require('./oauth-authorizations/oauth-authorizations.service.js');
const locationsRoomTypes = require('./locations-room-types/locations-room-types.service.js');
const locationsCountries = require('./locations-countries/locations-countries.service.js');
const locationsCities = require('./locations-cities/locations-cities.service.js');
const locationsBuildings = require('./locations-buildings/locations-buildings.service.js');
const locationsRooms = require('./locations-rooms/locations-rooms.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(pictures);
  app.configure(oauthClients);
  app.configure(oauthAuthorizationCodes);
  app.configure(oauthAuthorizations);
  app.configure(locationsRoomTypes);
  app.configure(locationsCountries);
  app.configure(locationsCities);
  app.configure(locationsBuildings);
  app.configure(locationsRooms);
};
