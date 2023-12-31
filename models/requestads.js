"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Requestads extends Model {
        static associate(models) {
        // define association here
        // Tag.belongsToMany(models.Blog, {
        //   through: "BlogTag",
        //   foreignKey: "tagId",
        //   otherKey: "blogId",
        // });
        Requestads.belongsTo(models.Place, { foreignKey: "placeId" });

        }
    }
    Requestads.init(
        {
            congTy: DataTypes.STRING,
            diaChiCongTy: DataTypes.STRING,
            dienThoai: DataTypes.STRING,
            email: DataTypes.STRING,
            placeId: DataTypes.INTEGER,
            tenBangQuangCao:DataTypes.STRING,
            noiDungQC:DataTypes.STRING,
            kichThuoc:DataTypes.STRING,
            soLuong:DataTypes.INTEGER,
            ngayBatDau:DataTypes.DATE,
            ngayKetThuc:DataTypes.DATE,
            tinhTrang:DataTypes.STRING,
            hinhAnh:DataTypes.STRING,
            hinhAnhId:DataTypes.STRING,

        },
        {
            sequelize,
            modelName: "Requestads",
        }
    );
    return Requestads;
};
