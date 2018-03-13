// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const pictures = sequelizeClient.define('pictures', {

    // picture identifiers
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },

    // picture meta-data
    format: {
      type: DataTypes.STRING,
      allowNull: false
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    checksum: {
      type: DataTypes.CHAR(32).BINARY
    },
    sizes: {
      type: DataTypes.TEXT('tiny'),
      allowNull: false,
      get() {
        return JSON.parse(this.getDataValue('sizes'));
      },
      set(val) {
        this.getDataValue('sizes', JSON.stringify(val));
      }
    },

    // not-so-important fields
    origin: {
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

  pictures.associate = function (models) { // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return pictures;
};
