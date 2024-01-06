const controller={};
const models = require("../../models");
const moment = require('moment');
const cloudinary=require('../../middlewares/cloudinary');

controller.deleteRequest=async(req,res)=>{
  let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
  let hinhAnhId = req.body.hinhAnhId;
  try {
    await models.Requestads.destroy(
      {where: {id}}
    );
    if(hinhAnhId) await cloudinary.uploader.destroy(hinhAnhId);
    res.send("Đã xoá yêu cầu!");
  } catch (error) {
    res.send("Không thể xoá yêu cầu!");
    console.error(error);
  }
}

controller.addRequest = async (req, res) => {
  const {
    congTy,
    diaChiCongTy,
    dienThoai,
    email,
    diaChiRequest,
    tenBangQuangCao,
    noiDungQC,
    kichThuoc,
    soLuong,
    ngayBatDau,
    ngayKetThuc,
  } = req.body;
  result={}

  const ngayBatDauDate = moment(ngayBatDau, 'MM/DD/YYYY', true);
  const ngayKetThucDate = moment(ngayKetThuc, 'MM/DD/YYYY', true);

  const isValidDateBD = ngayBatDauDate.isValid();
  const isValidDateKT = ngayKetThucDate.isValid();

  if (!isValidDateBD) {
    return res.json({ error: true, message: 'Ngày Bắt Đầu không hợp lệ!' });
  }
  if (!isValidDateKT) {
    return res.json({ error: true, message: 'Ngày Kết Thúc không hợp lệ!' });
  }
  if (ngayBatDauDate.isAfter(ngayKetThucDate)) {
    return res.json({ error: true, message: 'Ngày Bắt Đầu không thể sau Ngày Kết Thúc!' });
  }
  
  const requestPlace = await models.Place.findOne({ 
    attributes: ["id"],
    where: {diaChi: diaChiRequest} 
  });
  let placeId = requestPlace.getDataValue("id");
  
  try {
    if (req.file && req.file.path){
    result = await cloudinary.uploader.upload(req.file.path,{
      folder:'requestAds'
    });
  }

    await models.Requestads.create({
      congTy,
      diaChiCongTy,
      dienThoai,
      email,
      placeId:placeId,
      tenBangQuangCao,
      noiDungQC,
      kichThuoc,
      soLuong:soLuong||0,
      ngayBatDau,
      ngayKetThuc,
      tinhTrang: 'Chờ phê duyệt',
      hinhAnh:result.secure_url||'',
      hinhAnhId:result.public_id|'',
    });
    res.redirect('/PHCB-Phuong/requests');
  } catch (error) {
    if (result.public_id) {
      await cloudinary.uploader.destroy(result.public_id);
    }
    res.send('Không thể thêm');
    console.error(error);
  }
};
controller.show= async (req,res)=>{
  
  res.locals.adstypes = await models.Adstype.findAll({
    attributes: [
      "id",
      "name",
    ],
    order: [["createdAt", "DESC"]],
  });

  res.locals.places = await models.Place.findAll({
    
    attributes: [
      "id",
      "diaChi",
      "khuVuc",
      "loaiVT",
      "hinhThuc",
      "quyHoach",
      "hinhAnh",
      "longitude",
      "latitude"
    ],
    order: [["diaChi", "ASC"]],
    where: {
      khuVuc: `${req.user.wardUnit}, ${req.user.districtUnit}`
    }
  });

    res.locals.requests = await models.Requestads.findAll({
      include: [{
        model: models.Place,
        attributes: [
          "diaChi",
          "khuVuc",
          "loaiVT",
          "longitude",
          "latitude"
        ],
        where: {
          khuVuc: `${req.user.wardUnit}, ${req.user.districtUnit}`
        }
      }],
        attributes: [
            "id",
            "congTy",
            "diaChiCongTy",
            "dienThoai",
            "email",
            "tenBangQuangCao",
            "noiDungQC",
            "kichThuoc",
            "soLuong",
            "ngayBatDau",
            "ngayKetThuc",
            "tinhTrang",
            "hinhAnh",
            "hinhAnhId"
        ],
        order: [["createdAt", "DESC"]],
      });
    
      res.render("PHCB-Phuong/requests",{
        requests: res.locals.requests.map(detail => ({...detail.toJSON(),
          formattedNgayBatDau: moment(detail.ngayBatDau).format('MM/DD/YYYY'),
          formattedNgayKetThuc: moment(detail.ngayKetThuc).format('MM/DD/YYYY'),
        })), 
        layout:"PHCB-Phuong/layout"
      });
};

controller.editRequest = async (req, res) => {
  let {id,
    congTy,
    diaChiCongTy,
    dienThoai,
    email,
    diaChiRequest,
    tenBangQuangCao,
    noiDungQC,
    kichThuoc,
    soLuong,
    ngayBatDau,
    ngayKetThuc,
    tinhTrang,
    hinhAnhId} = req.body;
    let result ={}

    const ngayBatDauDate = moment(ngayBatDau, 'MM/DD/YYYY', true);
    const ngayKetThucDate = moment(ngayKetThuc, 'MM/DD/YYYY', true);
  
    const isValidDateBD = ngayBatDauDate.isValid();
    const isValidDateKT = ngayKetThucDate.isValid();

    if (!isValidDateBD) {
      return res.json({ error: true, message: 'Ngày Bắt Đầu không hợp lệ!' });
    }
  
    if (!isValidDateKT) {
      return res.json({ error: true, message: 'Ngày Kết Thúc không hợp lệ!' });
    }
    
    if (ngayBatDauDate.isAfter(ngayKetThucDate)) {
      return res.json({ error: true, message: 'Ngày Bắt Đầu không thể sau Ngày Kết Thúc!' });
    }
  
    const requestPlace = await models.Place.findOne({ 
      attributes: ["id"],
      where: {diaChi: diaChiRequest} 
    });
    let placeId = requestPlace.getDataValue("id");

  try {
    if (req.file && req.file.path) {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'requestAds'
      });
    }
    const updateData={
      congTy,
        diaChiCongTy,
        dienThoai,
        email,
        placeId:placeId,
        tenBangQuangCao,
        noiDungQC,
        kichThuoc,
        soLuong:soLuong||0,
        ngayBatDau,
        ngayKetThuc,
        tinhTrang,
    }
    if (result.secure_url) {
      updateData.hinhAnh = result.secure_url;
      updateData.hinhAnhId = result.public_id;
    }
    await models.Requestads.update(updateData,{where: {id}});
    if (hinhAnhId && result.secure_url) {
      await cloudinary.uploader.destroy(hinhAnhId);
    }
    res.send("Đã cập nhật yêu cầu!");
  } catch (error) {
    if (result.public_id) {
      await cloudinary.uploader.destroy(result.public_id);
    }
    res.send("Không thể cập nhật yêu cầu!");
    console.error(error);
  }
}
controller.isLoggedIn = async (req, res, next) => {
  if (req.user) {
      res.locals.user = req.user;
      if (req.user.isWard)
        next();
      else res.redirect('/');
  } else {
      res.redirect(`/login?reqUrl=${req.originalUrl}`);
  }
}
module.exports=controller;

