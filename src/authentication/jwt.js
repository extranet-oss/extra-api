const jwt = require('@feathersjs/authentication-jwt');

class CustomVerifier {

  constructor (app, options = {}) {
    this.app = app;
    this.options = options;

    this.verify = this.verify.bind(this);
  }

  verify(req, payload, done) {
    // do your custom stuff. You can call internal Verifier methods
    // and reference this.app and this.options. This method must be implemented.

    // the 'user' variable can be any truthy value
    // the 'payload' is the payload for the JWT access token that is generated after successful authentication

    // check token validity & infos
    if (!payload.ver || payload.ver != 1) {
      return done(null, false);
    }

    if (!payload.sub || payload.sub != 'extra-api:access_token') {
      return done(null, false);
    }

    if (!payload.client || !payload.scopes) {
      return done(null, false);
    }

    // Define default results
    var new_payload = {
        sub: 'extra-api:access_token',
        client: null,
        user: null,
        scopes: []
      },
      result = {
        client: null,
        user: null,
        authorization: null,
        scopes: []
      };

    // Load services
    const clients = this.app.service('oauth/clients');
    const authorizations = this.app.service('oauth/authorizations');
    const users = this.app.service('users');

    // Set scopes
    result.scopes = payload.scopes;
    new_payload.scopes = payload.scopes;

    // Process client
    clients.find({
      query: {
        id: payload.client.id,
        validity_token: payload.client.validity
      }
    })
      .then(matches => {
        if (matches.total == 0)
          return done(null, false);

        // Save client
        result.client = matches.data[0];
        new_payload.client = {
          id: result.client.id,
          validity: result.client.validity_token
        };

        // If associated user, process user
        if (payload.user) {
          users.find({
            query: { id: payload.user.id }
          })
            .then(matches => {
              if (matches.total == 0)
                return done(null, false);

              // Save user
              result.user = matches.data[0];
              new_payload.user = {
                id: result.user.id,
                authorization: null
              };

              // deny login if user is suspended
              if (result.user.suspended)
                return done(null, false, `Account suspended: ${result.user.suspended_reason ? result.user.suspended_reason : 'no info'}`);

              // Check if authorization is valid
              authorizations.find({
                query: { id: payload.user.authorization }
              })
                .then(matches => {
                  if (matches.total == 0)
                    return done(null, false);

                  // Save authorization
                  result.authorization = matches.data[0];
                  new_payload.user.authorization = result.authorization.id;

                  // finalize
                  done(null, result, new_payload);
                })
                .catch(err => done(err));
            })
            .catch(err => done(err));
        }
        else {
          done(null, result, new_payload);
        }
      })
      .catch(err => done(err));

  }
}

module.exports = function (app) {
  app.configure(jwt({
    Verifier: CustomVerifier
  }));
};
