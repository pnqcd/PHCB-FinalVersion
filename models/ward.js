"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ward extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Tag.belongsToMany(models.Blog, {
      //   through: "BlogTag",
      //   foreignKey: "tagId",
      //   otherKey: "blogId",
      // });
    }
  }
  Ward.init(
    {
      wardName: DataTypes.STRING,
      districtName: DataTypes.STRING,
      zipCode: DataTypes.INTEGER,
      population: DataTypes.INTEGER,
      imagePath: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Ward",
    }
  );
  return Ward;
};
