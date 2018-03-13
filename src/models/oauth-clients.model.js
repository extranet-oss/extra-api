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

    // client settings
    confidential: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    redirect_uris: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
      /*get() {
        return typeof this.getDataValue(field) === 'string' ? JSON.parse(this.getDataValue(field)) : this.getDataValue(field);
      },
      set(data) {
        this.setDataValue('redirect_uris', JSON.stringify(data));
      }*/
    },
    default_scopes: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
      /*get() {
        return typeof this.getDataValue(field) === 'string' ? JSON.parse(this.getDataValue(field)) : this.getDataValue(field);
      },
      set(data) {
        this.setDataValue('default_scopes', JSON.stringify(data));
      }*/
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

    this.belongsTo(models.users, {as: "owner"});
    this.belongsTo(models.pictures);
  };

  return oauthClients;
};
