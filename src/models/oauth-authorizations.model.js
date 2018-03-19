// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const oauthAuthorizations = sequelizeClient.define('oauth_authorizations', {

    // authorization identifiers
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    // authorization settings
    scopes: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },

    // metadata
    last_used: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  oauthAuthorizations.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    this.belongsTo(models.users);
    this.belongsTo(models.oauth_clients, {as: 'client'});
  };

  return oauthAuthorizations;
};
