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

  res.locals.requesteditads = await models.Requesteditads.findAll({
    include: [{
      model: models.Place,
      attributes: [
        "diaChi",
        "khuVuc",
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
      "liDoChinhSua"
    ],
    where: {
      '$Place.khuVuc$':`${req.user.wardUnit}, ${req.user.districtUnit}`,
    },
    order: [["createdAt", "DESC"]],
    // limit: 10,
  });

  res.render("PHCB-Phuong/manageAds", {
    placedetails: res.locals.placedetails.map(detail => ({
      ...detail.toJSON(),
      formattedExpireDay: moment(detail.expireDay).format('MM/DD/YYYY'),
    })),  
    requesteditads: res.locals.requesteditads.map(detail => ({
        ...detail.toJSON(),
        formattedExpireDay: moment(detail.expireDay).format('MM/DD/YYYY'),
      })),
    layout:"PHCB-Phuong/layout"
  });
};

controller.requestEditAds = async (req, res) => {
  let {adName, diaChiAds, adSize, adQuantity, expireDay, liDoChinhSua,imagePath,publicImageId} = req.body;
  let result ={};
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
    if (req.file && req.file.path){
    result = await cloudinary.uploader.upload(req.file.path,{
      folder:'ads'
    });
   }
    

    await models.Requesteditads.create({
      placeId: placeId,
      originId: originId,
      adName, 
      adSize, 
      adQuantity, 
      expireDay, 
      liDoChinhSua,
      imagePath:result.secure_url?result.secure_url:imagePath,
      publicImageId:result.public_id?result.public_id:publicImageId,
    });
    res.redirect("/PHCB-Phuong/manageAds");
  } catch (error) {
    res.send("Không thể gửi yêu cầu chỉnh sửa bảng QC");
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