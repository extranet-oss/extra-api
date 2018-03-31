// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const locationsRooms = sequelizeClient.define('locations_rooms', {

    // room identifiers
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

    // room infos
    disabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    seats: {
      type: DataTypes.INTEGER,
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
  locationsRooms.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    this.belongsTo(models.locations_countries, { as: 'country' });
    this.belongsTo(models.locations_cities, { as: 'city' });
    this.belongsTo(models.locations_buildings, { as: 'building' });
    this.belongsToMany(models.locations_room_types, {through: 'locations_rooms_xref_room_type', as: 'type'});
  };

  return locationsRooms;
};
