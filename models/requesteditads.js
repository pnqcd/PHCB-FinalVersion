"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Requesteditads extends Model {
        static associate(models) {
        // define association here
        Requesteditads.belongsTo(models.Place, { foreignKey: "placeId" });
        // Blog.belongsToMany(models.Tag, {
        //   through: "BlogTag",
        //   foreignKey: "blogId",
        //   otherKey: "tagId",
        // });
        // Blog.belongsTo(models.User, { foreignKey: "authorId" });
        // Blog.hasMany(models.Comment, { foreignKey: "blogId" });
        }
    }
    Requesteditads.init(
        {
            placeId: DataTypes.INTEGER,
            originId: DataTypes.INTEGER,
            adName: DataTypes.STRING,
            adSize: DataTypes.STRING,
            adQuantity: DataTypes.INTEGER,
            expireDay: DataTypes.DATE,
            imagePath: DataTypes.STRING,
            publicImageId: DataTypes.STRING,
            liDoChinhSua: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Requesteditads",
        }
    );
    return Requesteditads;
};
