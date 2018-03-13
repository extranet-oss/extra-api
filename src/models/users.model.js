// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const users = sequelizeClient.define('users', {

    // user identifiers
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    intra_id: {
      type: DataTypes.STRING(320),
      allowNull: false,
      unique: true
    },

    // human friendly identifier
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    realm: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // basic user info
    fullname: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // extranet-specific data
    suspended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    suspended_reason: {
      type: DataTypes.STRING
    },
    permission_level: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }

  }, {
    paranoid: true,
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  users.associate = function (models) { // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    this.belongsTo(models.pictures);
  };

  return users;
};
