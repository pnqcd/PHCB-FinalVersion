'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Requesteditplace extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Requesteditplace.init({
    placeId: DataTypes.INTEGER,
    diaChi: DataTypes.STRING,
    khuVuc: DataTypes.STRING,
    loaiVT: DataTypes.STRING,
    hinhThuc: DataTypes.STRING,
    hinhAnh: DataTypes.STRING,
    hinhAnhId: DataTypes.STRING,
    quyHoach: DataTypes.STRING,
    longitude: DataTypes.REAL,
    latitude: DataTypes.REAL,
    liDoChinhSua: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Requesteditplace',
  });
  return Requesteditplace;
};