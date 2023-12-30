"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Placedetail extends Model {
        static associate(models) {
        // define association here
        Placedetail.belongsTo(models.Place, { foreignKey: "placeId" });
        // Blog.belongsToMany(models.Tag, {
        //   through: "BlogTag",
        //   foreignKey: "blogId",
        //   otherKey: "tagId",
        // });
        // Blog.belongsTo(models.User, { foreignKey: "authorId" });
        // Blog.hasMany(models.Comment, { foreignKey: "blogId" });
        }
    }
    Placedetail.init(
        {
            placeId: DataTypes.INTEGER,
            adName: DataTypes.STRING,
            adSize: DataTypes.STRING,
            adQuantity: DataTypes.INTEGER,
            expireDay: DataTypes.DATE,
            imagePath: DataTypes.STRING,
            publicImageId: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Placedetail",
        }
    );
    return Placedetail;
};
