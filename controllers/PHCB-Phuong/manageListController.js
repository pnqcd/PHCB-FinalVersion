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

  res.render("PHCB-Phuong/manageList", {
    placedetails: res.locals.placedetails.map(detail => ({
      ...detail.toJSON(),
      formattedExpireDay: moment(detail.expireDay).format('MM/DD/YYYY'),
    })),  
    layout:"PHCB-Phuong/layout"
  });
};
controller.requestEditPlace = async (req, res) => {
  let {id, diaChi, khuVuc, loaiVT, hinhThuc, isQuyHoach, liDoChinhSua} = req.body;
  try {
    
      const result = await cloudinary.uploader.upload(req.file.path,{
        folder:'places'
      });

    await models.Requesteditplace.create({
      placeId: id,
      diaChi, 
      khuVuc, 
      loaiVT, 
      hinhThuc, 
      quyHoach: isQuyHoach ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH",
      liDoChinhSua,
      hinhAnh:result.secure_url,
      hinhAnhId:result.public_id,
    });
    res.redirect("/manageList");
  } catch (error) {
    res.send("Không thể thêm điểm đặt");
    cloudinary.uploader.destroy(result.secure_url);
    console.error(error);
  }
}

controller.requestEditAds = async (req, res) => {
  let {adName, diaChiAds, adSize, adQuantity, expireDay, liDoChinhSua} = req.body;

  const parsedDate = moment(expireDay, 'MM/DD/YYYY', true);
  const isValidDate = parsedDate.isValid();

  if (!isValidDate) {
    return res.json({ error: true, message: 'Ngày không hợp lệ!' });
  }

  const adsPlace = await models.Place.findOne({ 
    attributes: ["id"],
    where: {diaChi: diaChiAds} 
  });

  let placeId = adsPlace.getDataValue("id");

  const adsOriginPlace = await models.Placedetail.findOne({ 
    attributes: ["id"],
    where: {placeId: placeId} 
  });

  let originId = adsOriginPlace.getDataValue("id");

  try {
    const result = await cloudinary.uploader.upload(req.file.path,{
      folder:'ads'
    });
    

    await models.Requesteditads.create({
      placeId: placeId,
      originId: originId,
      adName, 
      adSize, 
      adQuantity, 
      expireDay, 
      liDoChinhSua,
      imagePath:result.secure_url,
      publicImageId:result.public_id,
    });
    res.redirect("/PHCB-Phuong/manageList");
  } catch (error) {
    res.send("Không thể gửi yêu cầu chỉnh sửa bảng QC");
    console.error(error);
}
}
controller.isLoggedIn = async (req, res, next) => {
  if (req.user) {
      res.locals.user = req.user;
      next();
  } else {
      res.redirect(`/login?reqUrl=${req.originalUrl}`);
  }
}

module.exports=controller;