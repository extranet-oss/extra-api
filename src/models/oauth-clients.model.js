// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const oauthClients = sequelizeClient.define('oauth_clients', {

    // client identifiers
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    // client credentials
    secret: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: false
    },
    validity_token: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: false
    },

    // client settings
    confidential: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    redirect_uris: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    listed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    required_permission_level: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    trusted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    // client info
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    website: {
      type: DataTypes.STRING,
      allowNull: false
    }

  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  oauthClients.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    this.belongsTo(models.users, {as: 'owner'});
    this.belongsTo(models.pictures);
  };

  return oauthClients;
};
