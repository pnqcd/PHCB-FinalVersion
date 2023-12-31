const controller = {};
const models = require("../../models");
const { Op } = require('sequelize');
const moment = require('moment');
const cloudinary=require('../../middlewares/cloudinary');
const upload=require('../../middlewares/multer');



controller.show = async (req, res) => {
  res.locals.wards = await models.Ward.findAll({
    attributes: [
      "id",
      "wardName",
      "districtName",
      "zipCode",
      "population",
      "imagePath",
    ],
    where: {
      districtName: req.user.districtUnit,
    },
    order: [["createdAt", "DESC"]],
  });
  res.locals.places = await models.Place.findAll({
    attributes: [
      "id",
      "diaChi",
      "khuVuc",
      "loaiVT",
      "hinhThuc",
      "hinhAnhId",
      "quyHoach",
      "hinhAnh",
    ],
    where: {
      khuVuc: {
        [Op.like]: `%${req.user.districtUnit}%`, // Use the like operator to check for 'Quận 5' in khuVuc
      },
    },
    order: [["createdAt", "DESC"]],
  });

  res.locals.placedetails = await models.Placedetail.findAll({
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
    ],
    where: {
      '$Place.khuVuc$': {
        [Op.like]: `%${req.user.districtUnit}%`, // Use the like operator to check for 'Quận 5' in khuVuc
      },
    },
    order: [["createdAt", "DESC"]],
    // limit: 10,
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
    ],
    where: {
      '$Place.khuVuc$': {
        [Op.like]: `%${req.user.districtUnit}%`, // Use the like operator to check for 'Quận 5' in khuVuc
      },
    },
    order: [["createdAt", "DESC"]],
    // limit: 10,
  });

  res.locals.adstypes = await models.Adstype.findAll({
    attributes: [
      "id",
      "name",
    ],
    order: [["createdAt", "DESC"]],
  });

  res.locals.reporttypes = await models.Reporttype.findAll({
    attributes: [
      "id",
      "name",
    ],
    order: [["createdAt", "DESC"]],
  });

  res.render("PHCB-Quan/manage-ads", {
    placedetails: res.locals.placedetails.map(detail => ({
      ...detail.toJSON(),
      formattedExpireDay: moment(detail.expireDay).format('MM/DD/YYYY'),
    })),
    requesteditads: res.locals.requesteditads.map(detail => ({
      ...detail.toJSON(),
      formattedExpireDay: moment(detail.expireDay).format('MM/DD/YYYY'),
    })),
    layout: "PHCB-Quan/layout"
  });
};

controller.requestEditAds = async (req, res) => {
  let { id, adName, diaChiAds, adSize, adQuantity, expireDay, liDoChinhSua, imagePath, publicImageId} = req.body;
  result = {}
  const existingPlace = await models.Requesteditads.findOne({
    where: {
      originId: id,
    },
  });

  const parsedDate = moment(expireDay, 'MM/DD/YYYY', true);
  const isValidDate = parsedDate.isValid();

  if (!isValidDate) {
    return res.json({ error: true, message: 'Ngày không hợp lệ!' });
  }

  const adsPlace = await models.Place.findOne({
    attributes: ["id"],
    where: { diaChi: diaChiAds }
  });

  let placeId = adsPlace.getDataValue("id");

  try {
    
    if (existingPlace) {
      // Nếu id đã tồn tại, có thể xử lý thông báo hoặc chuyển hướng
      res.send("Vui lòng chỉnh sửa thêm ở danh sách yêu cầu chỉnh sửa bảng quảng cáo");
    }
    
    else {
      if (req.file && req.file.path) {
        result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'ads'
        });
      }
      await models.Requesteditads.create({
        placeId: placeId,
        originId: id,
        adName,
        adSize,
        adQuantity,
        expireDay,
        liDoChinhSua,
        imagePath:result.secure_url ? result.secure_url : imagePath,
        publicImageId:result.public_id ? result.public_id : publicImageId,
      });
      res.redirect("/PHCB-Quan/bang-quang-cao");
    }
  } catch (error) {
    if (result.public_id) {
      await cloudinary.uploader.destroy(result.public_id);
    }
    res.send("Không thể gửi yêu cầu chỉnh sửa bảng QC");
    console.error(error);
  }
}

controller.continueRequestEditAds = async (req, res) => {
  let {id, originId, adName, diaChiAds, adSize, adQuantity, expireDay, publicImageId, liDoChinhSua} = req.body;
  let result = {}

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

  try {

    if (req.file && req.file.path) {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'ads'
      });
    }
    const updateData = {
      placeId: placeId,
        originId: originId,
        adName, 
        adSize, 
        adQuantity, 
        expireDay,
        liDoChinhSua,
    }
    if (result.secure_url) {
      updateData.imagePath = result.secure_url;
      updateData.publicImageId = result.public_id;
    }
    await models.Requesteditads.update(updateData,{where: {id}});
    if (publicImageId && result.secure_url) {
      await cloudinary.uploader.destroy(publicImageId);
    }
    
    res.send("Đã cập nhật bảng QC!");
  } catch (error) {
    if (result.public_id) {
      await cloudinary.uploader.destroy(result.public_id);
    }
    res.send("Không thể cập nhật bảng QC!");
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

module.exports = controller;
