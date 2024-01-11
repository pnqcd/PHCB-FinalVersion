const controller={};
const models = require("../../models");
const moment = require('moment');
const cloudinary=require('../../middlewares/cloudinary');

controller.show = async (req, res) => {
  
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
      "hinhAnhId",
      "longitude",
      "latitude"
    ],
    order: [["createdAt", "DESC"]],
    where:{
      khuVuc: `${req.user.wardUnit}, ${req.user.districtUnit}`
    }
  });

  res.locals.placedetails = await models.Placedetail.findAll({
    include: [{
      model: models.Place,
      attributes: [
        "diaChi",
        "khuVuc"
      ],
    }],
    attributes: [
      "id",
      "adName",
      "adSize",
      "adQuantity",
      "expireDay",
      "imagePath",
      "publicImageId",
    ],
    where: {
      '$Place.khuVuc$':`${req.user.wardUnit}, ${req.user.districtUnit}`
    },
    order: [[models.Place, "createdAt", "DESC"]],
    
  });

  res.locals.requesteditplaces = await models.Requesteditplace.findAll({
    attributes: [
      "id",
      "diaChi",
      "khuVuc",
      "loaiVT",
      "hinhThuc",
      "longitude",
      "latitude",
      "quyHoach",
      "hinhAnh",
      "hinhAnhId",
      "liDoChinhSua"
    ],
    where: { 
        khuVuc:`${req.user.wardUnit}, ${req.user.districtUnit}`
    },
    order: [["createdAt", "DESC"]],
  });

  res.render("PHCB-Phuong/manageList", {
    placedetails: res.locals.placedetails.map(detail => ({
      ...detail.toJSON(),
      formattedExpireDay: moment(detail.expireDay).format('MM/DD/YYYY'),
    })),  
    layout:"PHCB-Phuong/layout"
  });
};
controller.requestEditPlace = async (req, res) => {
  let {id, diaChi, khuVuc, loaiVT, hinhThuc,longitude,latitude, isQuyHoach, liDoChinhSua ,hinhAnh, hinhAnhId} = req.body;
  let result ={};
  try {
    if (req.file && req.file.path){
     result = await cloudinary.uploader.upload(req.file.path,{
        folder:'places'
      });
    }
    await models.Requesteditplace.create({
      placeId: id,
      diaChi, 
      khuVuc, 
      loaiVT, 
      hinhThuc, 
      longitude,
      latitude,
      quyHoach: isQuyHoach ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH",
      liDoChinhSua,
      hinhAnh:result.secure_url ? result.secure_url : hinhAnh,
      hinhAnhId:result.public_id ? result.public_id : hinhAnhId,
    });
    res.redirect("/PHCB-Phuong/manageList");
  } catch (error) {
    res.send("Không thể thêm điểm đặt");
    if(result.public_id) cloudinary.uploader.destroy(result.public_id);
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