// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const locationsBuildings = sequelizeClient.define('locations_buildings', {

    // building identifiers
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

    // building infos
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
  locationsBuildings.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    this.belongsTo(models.locations_countries, { as: 'country' });
    this.belongsTo(models.locations_cities, { as: 'city' });
    this.hasMany(models.locations_rooms, { as: 'rooms', foreignKey: 'building_id' });
  };

  return locationsBuildings;
};
