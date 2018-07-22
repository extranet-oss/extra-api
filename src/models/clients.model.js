// clients-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema, SchemaTypes } = mongooseClient;
  const clients = new Schema({

    // critical client data
    secret: { type: String, required: true },
    type: { type: String, required: true, enum: ['web', 'native'] },
    redirect_uris: [{ type: SchemaTypes.Url, required: true }],

    // meta data
    name: { type: String, required: true, trim: true },
    description: { type: String },
    links: {
      homepage: { type: SchemaTypes.Url },
      login: { type: SchemaTypes.Url },
      privacy: { type: SchemaTypes.Url },
      tos: { type: SchemaTypes.Url }
    },
    listed: { type: Boolean, required: true, default: false },

    // trusted apps get extra features
    trusted: { type: Boolean, required: true, default: false },
    session: {
      post_logout_redirect_uris: [{ type: SchemaTypes.Url }],
      backchannel_logout_session_required: { type: Boolean },
      backchannel_logout_uri: { type: SchemaTypes.Url },
      frontchannel_logout_session_required: { type: Boolean },
      frontchannel_logout_uri: { type: SchemaTypes.Url }
    },
    web_message_uris: [{ type: SchemaTypes.Url }]
  }, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    minimize: false
  });

  return mongooseClient.model('clients', clients);
};
