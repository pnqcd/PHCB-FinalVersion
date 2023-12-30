const controller = {};
const models = require("../../models");
const moment = require('moment');
const cloudinary = require('../../middlewares/cloudinary');

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
    // limit: 10,
  });

  // models.Place.hasMany(models.Placedetail, { foreignKey: 'placeId' });
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
      "publicImageId"
    ],
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

  res.render("PHCB-So/manage-list", {
    placedetails: res.locals.placedetails.map(detail => ({
      ...detail.toJSON(),
      formattedExpireDay: moment(detail.expireDay).format('MM/DD/YYYY'),
    })),  
    layout: "PHCB-So/layout"
  });
};

controller.addWard = async (req, res) => {
  let {wardName, districtName, zipCode, population} = req.body;
  try {
    await models.Ward.create({
      wardName, 
      districtName, 
      zipCode, 
      population
    });
    res.redirect("/PHCB-So/danh-sach");
  } catch (error) {
    res.send("Không thể thêm phường");
    console.error(error);
  }
}

controller.editWard = async (req, res) => {
  let {id, wardName, districtName, zipCode, population} = req.body;
  try {
    await models.Ward.update(
      {wardName, districtName, zipCode, population},
      {where: {id}}
    );
    res.send("Đã cập nhật phường!");
  } catch (error) {
    res.send("Không thể cập nhật phường!");
    console.error(error);
  }
}

controller.deleteWard = async (req, res) => {
  let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
  try {
    await models.Ward.destroy(
      {where: {id}}
    );
    res.send("Đã xoá phường!");
  } catch (error) {
    res.send("Không thể xoá phường!");
    console.error(error);
  }
}

controller.addPlace = async (req, res) => {
  let {diaChi, khuVuc, loaiVT, hinhThuc, isQuyHoach,longitude,latitude} = req.body;
  let result = {};
  try {
    if (req.file && req.file.path) {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'places'
      });
    }
    await models.Place.create({
      diaChi, 
      khuVuc, 
      loaiVT, 
      hinhThuc, 
      longitude: longitude||0,
      latitude:latitude||0,
      quyHoach: isQuyHoach ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH",
      hinhAnh:result.secure_url||'',
      hinhAnhId:result.public_id||'',
    });
    res.redirect("/PHCB-So/danh-sach/#place-list");
  } catch (error) {
    if (result.public_id) {
      await cloudinary.uploader.destroy(result.public_id);
    }
    res.send("Không thể thêm điểm đặt");
    console.error(error);
  }
}

controller.editPlace = async (req, res) => {
  let {id, diaChi, khuVuc, loaiVT, hinhThuc, isQuyHoach,longitude,latitude,hinhAnhId} = req.body;
  let result ={}
  try {
    if (req.file && req.file.path) {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'places'
      });
    }
    const updateData = { 
      diaChi, 
      khuVuc, 
      loaiVT, 
      hinhThuc, 
      longitude:longitude||0,
      latitude:latitude||0,
      quyHoach: isQuyHoach ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH",
    };

    if (result.secure_url) {
      updateData.hinhAnh = result.secure_url;
      updateData.hinhAnhId = result.public_id;
    }

    await models.Place.update(updateData, {where: {id}});

    if (hinhAnhId && result.secure_url) {
      await cloudinary.uploader.destroy(hinhAnhId);
    }
    res.send("Đã cập nhật điểm đặt!");
  } catch (error) {
    if (result.public_id) {
      await cloudinary.uploader.destroy(result.public_id);
    }
    res.send("Không thể cập nhật điểm đặt!");
    console.error(error);
  }
}

controller.deletePlace = async (req, res) => {
  let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
  let hinhAnhId=req.body.hinhAnhId;
  try {
    await models.Place.destroy(
      {where: {id}}
    );
    if(hinhAnhId) await cloudinary.uploader.destroy(hinhAnhId);
    res.send("Đã xoá điểm đặt!");
  } catch (error) {
    res.send("Không thể xoá điểm đặt!");
    console.error(error);
  }
}

controller.addAds = async (req, res) => {
  let {adName, diaChiAds, adSize, adQuantity, expireDay} = req.body;

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
    await models.Placedetail.create({
      placeId: placeId,
      adName, 
      adSize, 
      adQuantity, 
      expireDay, 
    });
    res.redirect("/PHCB-So/danh-sach/#ads-list");
  } catch (error) {
    res.send("Không thể thêm bảng QC");
    console.error(error);
  }
}

controller.editAds = async (req, res) => {
  let {id, adName, diaChiAds, adSize, adQuantity, expireDay} = req.body;

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
    await models.Placedetail.update(
      { 
        placeId: placeId,
        adName, 
        adSize, 
        adQuantity, 
        expireDay,
      },
      {where: {id}}
    );
    res.send("Đã cập nhật bảng QC!");
  } catch (error) {
    res.send("Không thể cập nhật bảng QC!");
    console.error(error);
  }
}

controller.deleteAds = async (req, res) => {
  let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
  try {
    await models.Placedetail.destroy(
      {where: {id}}
    );
    res.send("Đã xoá bảng QC!");
  } catch (error) {
    res.send("Không thể xoá bảng QC!");
    console.error(error);
  }
}

controller.addAdstype = async (req, res) => {
  let {adstypeName} = req.body;
  try {
    await models.Adstype.create({
      name: adstypeName
    });
    res.redirect("/PHCB-So/danh-sach/#type-list");
  } catch (error) {
    res.send("Không thể thêm loại hình QC");
    console.error(error);
  }
}

controller.editAdstype = async (req, res) => {
  let {id, adstypeName} = req.body;
  try {
    await models.Adstype.update(
      {name: adstypeName},
      {where: {id}}
    );
    res.send("Đã cập nhật loại hình QC!");
  } catch (error) {
    res.send("Không thể cập nhật loại hình QC!");
    console.error(error);
  }
}

controller.deleteAdstype = async (req, res) => {
  let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
  try {
    await models.Adstype.destroy(
      {where: {id}}
    );
    res.send("Đã xoá loại hình QC!");
  } catch (error) {
    res.send("Không thể xoá loại hình QC!");
    console.error(error);
  }
}

controller.addReporttype = async (req, res) => {
  let {reporttypeName} = req.body;
  try {
    await models.Reporttype.create({
      name: reporttypeName
    });
    res.redirect("/PHCB-So/danh-sach/#type-list");
  } catch (error) {
    res.send("Không thể thêm hình thức báo cáo");
    console.error(error);
  }
}

controller.editReporttype = async (req, res) => {
  let {id, reporttypeName} = req.body;
  try {
    await models.Reporttype.update(
      {name: reporttypeName},
      {where: {id}}
    );
    res.send("Đã cập nhật hình thức báo cáo!");
  } catch (error) {
    res.send("Không thể cập nhật hình thức báo cáo!");
    console.error(error);
  }
}

controller.deleteReporttype = async (req, res) => {
  let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
  try {
    await models.Reporttype.destroy(
      {where: {id}}
    );
    res.send("Đã xoá hình thức báo cáo!");
  } catch (error) {
    res.send("Không thể xoá hình thức báo cáo!");
    console.error(error);
  }
}

// route middleware to ensure user is logged in 
controller.isLoggedIn = async (req, res, next) => {
  if (req.user) {
      res.locals.user = req.user;
      next();
  } else {
      res.redirect(`/login?reqUrl=${req.originalUrl}`);
  }
}

module.exports = controller;
