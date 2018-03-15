const jwt = require('@feathersjs/authentication-jwt');

class CustomVerifier {

  constructor (app, options = {}) {
    this.app = app;
    this.options = options;
    this.service = typeof options.service === 'string' ? app.service(options.service) : options.service;

    if (!this.service) {
      throw new Error('options.service does not exist.\n\tMake sure you are passing a valid service path or service instance and it is initialized before @feathersjs/authentication-jwt.');
    }

    this.verify = this.verify.bind(this);
  }

  verify(req, payload, done) {
    // do your custom stuff. You can call internal Verifier methods
    // and reference this.app and this.options. This method must be implemented.

    // the 'user' variable can be any truthy value
    // the 'payload' is the payload for the JWT access token that is generated after successful authentication
    //console.log(payload);
    const id = payload[`${this.options.entity}Id`];

    if (id === undefined) {
      return done(null, payload.sub, {});
    }

    this.service.get(id).then(entity => {
      const newPayload = { [`${this.options.entity}Id`]: id };
      return done(null, entity, newPayload);
    })
      .catch(error => {
        return done(error);
      });
  }
}

module.exports = function (app) {
  app.configure(jwt({
    Verifier: CustomVerifier
  }));
};
