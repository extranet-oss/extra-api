// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const locationsRoomTypes = sequelizeClient.define('locations_room_types', {

    // room type identifiers
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
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    // room type infos
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  locationsRoomTypes.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return locationsRoomTypes;
};
