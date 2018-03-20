const concat = require('lodash/concat');
const uniq = require('lodash/uniq');
const difference = require('lodash/difference');

module.exports = (app, client, user, scopes, gen_refresh_token, done) => {

  const authorizations = app.service('oauth/authorizations');
  const tokens = app.service(app.get('authentication').path);

  // functions to generate accessToken & refreshToken according to payload
  function gen_tokens(payload, gen_refresh_token, done) {

    // Create accessToken JWT
    tokens.create({}, {
      jwt: { subject: 'extra-api:access_token' },
      payload: payload
    })
    .then(result => {

      // finish immediately if no refreshToken needed
      if (!gen_refresh_token)
        return done(null, result.accessToken);

      // Todo: Create refreshToken JWT
      done(null, result.accessToken, "refreshtoken");
    })
    .catch((err) => {
      done(err);
    });
  }

  // Fill in initial info in JWT
  var payload = {
    ver: 1,
    client: null,
    user: null,
    scopes: scopes
  };

  // Todo: Check if scopes are applicable

  // Fill-in client info in JWT
  payload.client = {
    id: client.id,
    validity: client.validity_token
  }

  // If no associated user, go straight to token generation using this payload
  if (!user) {
    return gen_tokens(payload, gen_refresh_token, done);
  }

  // Todo: Check if required permissions are met
  // Todo: Check if user suspended

  // Check if client has been authorized before
  authorizations.find({
    query: {
      user_id: user.id,
      client_id: client.id
    }
  })
  .then(matches => {

    // Function used to finalize authorization process
    function finalize_authorization(record) {
      console.log(record)
      // Fill-in user info in JWT
      payload.user = {
        id: user.id,
        authorization: record.id
      };

      // Launch token generation
      return gen_tokens(payload, gen_refresh_token, done);
    }

    // Client has not been authorized yet, create record
    if (matches.total == 0) {
      authorizations.create({
        scopes: scopes,
        user_id: user.id,
        client_id: client.id
      })
      .then(finalize_authorization)
      .catch(err => done(err));
    }

    // Client has already been authorized, update scopes
    else {
      authorizations.patch(matches.data[0].id, {
        scopes: uniq(concat(matches.data[0].scopes, scopes))
      })
      .then(finalize_authorization)
      .catch(err => done(err));
    }
  })
  .catch(err => done(err));
}
