const controller = {};
const models = require("../../models");
const { Op } = require('sequelize');
const moment = require('moment');
const pool = require("../../database/database");
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
      "longitude",
      "latitude",
      "quyHoach",
      "hinhAnh",
      "hinhAnhId",
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

  res.locals.requestads = await models.Requestads.findAll({
    include: [{
      model: models.Place,
      attributes: [
        "diaChi",
        "khuVuc",
        "loaiVT",
        "longitude",
        "latitude"
      ],
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
    order: [["congTy", "ASC"]],
    where: {
      '$Place.khuVuc$': {
        [Op.like]: `%${req.user.districtUnit}%`, // Use the like operator to check for 'Quận 5' in khuVuc
      },
    },
  });


  // report
  const report = pool.query(`SELECT id, "lat", "lng", "reportername", "typeofreport", "reporteremail", "reporterphonenumber", "reportcontent", "imagepath1", "imagepath2", "locationreport", "adbannerreportid", "handlemethod", "reportlocation", "reportkhuvuc", "time_added"
        FROM "reports"
        ORDER BY "reportlocation" ASC`
  );
  const [reportResult] = await Promise.all([report]);
  res.locals.reports = reportResult.rows;
  // Replace this line with your actual HERE API key
  // const apiKey = "ylfzo_XrCL0wFOWqMdk89chLwml3by9ZPi5U6J-S3EU";
  const apiKey = "C_monOk25e39iLpYuDPsSnx8KVWlnvKdYdaAaNeYzl4";

  for (const report of res.locals.reports) {
    const lat = report.lat; // replace with the actual latitude value
    const lng = report.lng; // replace with the actual longitude value

    const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat}%2C${lng}&lang=vi-VN&apiKey=${apiKey}`;

    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const address = data.items[0].address;
        const title = address.label;
        const content = title.replace(/, Hồ Chí Minh, Việt Nam$/, '');
        // const matches = content.match(/(Phường[^,]+),([^,]+)$/);
        const zone = address.district + ", " + address.city;
        // Update the reportlocation field in the database
        await pool.query(
          `UPDATE "reports" SET "reportlocation" = $1, "reportkhuvuc" = $2 WHERE id = $3`,
          [content, zone, report.id]
        );
        // if (matches && matches.length === 3) {
        //   const phuong = matches[1].trim();
        //   const quan = matches[2].trim();

        //   // Update the reportkhuvuc field in the database
        //   await pool.query(
        //     `UPDATE "reports" SET "reportkhuvuc" = $1 WHERE id = $2`,
        //     [`${phuong}, ${quan}`, report.id]
        //   );
        // }
      }
    } else if (response.status === 401) {
      console.error("Unauthorized. Please check your HERE API key and permissions.");
    } else {
      console.error(`Error fetching data from HERE API. Status: ${response.status}`);
    }
  }

  res.locals.reports = res.locals.reports.filter(report =>
    report.reportlocation.includes(req.user.districtUnit));

  res.render("PHCB-Quan/manage-list", {
    placedetails: res.locals.placedetails.map(detail => ({
      ...detail.toJSON(),
      formattedExpireDay: moment(detail.expireDay).format('MM/DD/YYYY'),
    })),
    requestads: res.locals.requestads.map(detail => ({
      ...detail.toJSON(),
      formattedNgayBatDau: moment(detail.ngayBatDau).format('MM/DD/YYYY'),
      formattedNgayKetThuc: moment(detail.ngayKetThuc).format('MM/DD/YYYY'),
    })),
    layout: "PHCB-Quan/layout"
  });
};

controller.requestEditPlace = async (req, res) => {
  let {id, diaChi, khuVuc, loaiVT, hinhThuc, longitude, latitude, isQuyHoach, liDoChinhSua, hinhAnh, hinhAnhId} = req.body;
  result = {}
  console.log(hinhAnhId);
  const existingPlace = await models.Requesteditplace.findOne({
    where: {
      placeId: id,
    },
  });
  try {
    if (existingPlace) {
      // Nếu id đã tồn tại, có thể xử lý thông báo hoặc chuyển hướng
      res.send("Vui lòng chỉnh sửa thêm ở danh sách yêu cầu chỉnh sửa điểm đặt bảng quảng cáo");
    }
    else {
      // const result = await cloudinary.uploader.upload(req.file.path,{
      //   folder:'places'
      // });
      if (req.file && req.file.path) {
        result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'places'
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
        hinhAnh: result.secure_url ? result.secure_url : hinhAnh,
        hinhAnhId: result.public_id ? result.public_id : hinhAnhId,
      });
      res.redirect("/PHCB-Quan/diem-dat-bang-quang-cao");
    }
  } catch (error) {
    if (result.public_id) {
      await cloudinary.uploader.destroy(result.public_id);
    }
    res.send("Không thể thêm điểm đặt");
    console.error(error);
  }
}


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

controller.deleteRequest = async (req, res) => {
  let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
  let hinhAnhId = req.body.hinhAnhId;

  try {
    await models.Requestads.destroy(
      { where: { id } }
    );
    if (hinhAnhId) await cloudinary.uploader.destroy(hinhAnhId);

    res.send("Đã xoá yêu cầu!");
  } catch (error) {
    res.send("Không thể xoá yêu cầu!");
    console.error(error);
  }
}


controller.addRequest = async (req, res) => {
  if (!req.body || typeof req.body !== 'object') {
    res.send('Invalid request body');
    return;
  }

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
  result = {}

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
    where: { diaChi: diaChiRequest }
  });
  let placeId = requestPlace.getDataValue("id");

  try {
    if (req.file && req.file.path) {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'requestAds'
      });
    }
    await models.Requestads.create({
      congTy,
      diaChiCongTy,
      dienThoai,
      email,
      placeId: placeId,
      tenBangQuangCao,
      noiDungQC,
      kichThuoc,
      soLuong: soLuong || 0,
      ngayBatDau,
      ngayKetThuc,
      tinhTrang: 'Chờ phê duyệt',
      hinhAnh: result.secure_url || '',
      hinhAnhId: result.public_id | '',
    });
    res.redirect('/PHCB-Quan/yeu-cau');
  } catch (error) {
    if (result.public_id) {
      await cloudinary.uploader.destroy(result.public_id);
    }
    res.send('Không thể thêm');
    console.error(error);
  }
};

controller.editRequest = async (req, res) => {
  let { id,
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
    hinhAnhId
  } = req.body;

  let result = {}

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
    where: { diaChi: diaChiRequest }
  });
  let placeId = requestPlace.getDataValue("id");
  try {
    if (req.file && req.file.path) {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'requestAds'
      });
    }

    const updateData = {
      congTy,
      diaChiCongTy,
      dienThoai,
      email,
      placeId: placeId,
      tenBangQuangCao,
      noiDungQC,
      kichThuoc,
      soLuong,
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
};

controller.handleReport = async (req, res) => {
  let { id, handlemethodedit } = req.body;
  try {
    const updateQuery = `UPDATE "reports"
                              SET "handlemethod" = $1
                              WHERE id = $2`;
    await pool.query(updateQuery, [
      handlemethodedit,
      id
    ]);
    res.send("Đã cập nhật bảng QC!");
  } catch (error) {
    console.error(error);
  }
}

controller.isLoggedIn = async (req, res, next) => {
  if (req.user) {
      res.locals.user = req.user;
      if (req.user.isDistrict)
        next();
      else res.redirect('/');
  } else {
      res.redirect(`/login?reqUrl=${req.originalUrl}`);
  }
}
module.exports = controller;
