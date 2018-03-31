// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const locationsCities = sequelizeClient.define('locations_cities', {

    // city identifiers
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
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: true
    },

    // city infos
    disabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false
    },
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
  locationsCities.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    this.belongsTo(models.locations_countries, { as: 'country' });
    this.hasMany(models.locations_buildings, { as: 'buildings', foreignKey: 'city_id' });
    this.hasMany(models.locations_rooms, { as: 'rooms', foreignKey: 'city_id' });
  };

  return locationsCities;
};
