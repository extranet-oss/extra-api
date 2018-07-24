// authorizations-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema, SchemaTypes } = mongooseClient;
  const authorizations = new Schema({
    scopes: [{ type: String, required: true }],
    client_id: { type: SchemaTypes.ObjectId, required: true },
    user_id: { type: SchemaTypes.ObjectId, required: true }
  }, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    minimize: false
  });

  return mongooseClient.model('authorizations', authorizations);
};
