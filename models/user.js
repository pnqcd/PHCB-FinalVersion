"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // User.hasMany(models.Blog, { foreignKey: "authorId" });
      // User.hasMany(models.Comment, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      fullName: DataTypes.STRING,
      mobile: DataTypes.STRING,
      imagePath: DataTypes.STRING,
      publicImageId: DataTypes.STRING,
      dob: DataTypes.STRING,
      email: DataTypes.STRING,
      isWard: DataTypes.BOOLEAN,
      isDistrict: DataTypes.BOOLEAN,
      isDepartment: DataTypes.BOOLEAN,
      wardUnit: DataTypes.STRING,
      districtUnit: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
