"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Adstype extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Adstype.hasMany(models.Blog, { foreignKey: "AdstypeId" });
    }
  }
  Adstype.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Adstype",
    }
  );
  return Adstype;
};
