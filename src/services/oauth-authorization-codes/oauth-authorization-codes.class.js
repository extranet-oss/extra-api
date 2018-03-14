const errors = require('@feathersjs/errors');
const merge = require('lodash.merge');
const redis = require('redis');
const uid2 = require('uid2');

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};

    if (!options.store) {
      throw new Error(`No storage method passed`);
    }

    if (!options.store.redis) {
      throw new Error(`No redis configuration passed`);
    }

    this.client = redis.createClient(options.store.redis);
  }

  /*async find (params) {
    return [];
  }*/

  async get (id, params) {
    return new Promise((resolve, reject) => {
      this.client.get(id, function(err, reply) {
        if (err) return reject(err);
        if (!reply) return reject(new errors.NotFound());

        var data = JSON.parse(reply.toString());

        resolve(merge({ id }, data));
      });
    });
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return await Promise.all(data.map(current => this.create(current)));
    }

    return new Promise((resolve, reject) => {
      var id = uid2(512);
      var payload = JSON.stringify(merge(data, {
        id
      }));

      // we'll might need to verify if id is not already existing

      this.client.set(data.id, payload, "EX", 10 * 60, "NX", function(err, reply) {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  /*async update (id, data, params) {
    return data;
  }*/

  /*async patch (id, data, params) {
    return data;
  }*/

  async remove (id, params) {
    return new Promise((resolve, reject) => {
      this.client.del(id, function(err, reply) {
        if (err) return reject(err);

        resolve({ id });
      });
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
