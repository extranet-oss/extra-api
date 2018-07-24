// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema, SchemaTypes } = mongooseClient;
  const users = new Schema({

    // intranet relations
    intra_code: { type: String, required: true, unique: true },

    // basic personnal data
    slug: { type: String, required: true, unique: true, lowercase: true },
    realm: { type: String, required: true, lowercase: true },
    name: { type: String, required: true, trim: true },

    // registered personnal data
    registered: { type: Boolean, required: true, default: false },
    registered_at: { type: Date },
    email: { type: SchemaTypes.Email, unique: true },
    given_name: { type: String },
    family_name: { type: String },

    // persistent user data
    suspended: { type: Boolean, required: true, default: false },
    suspended_reason: { type: String }
  }, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    minimize: false
  });

  return mongooseClient.model('users', users);
};
