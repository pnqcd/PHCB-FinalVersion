const controller = {};
const models = require("../../models");
const { Op } = require('sequelize');
const pool = require("../../database/database");

controller.show = async (req, res) => {

  const report = pool.query(`SELECT id, "lat", "lng", "reportername", "typeofreport", "reporteremail", "reporterphonenumber", "reportcontent", "imagepath1", "imagepath2", "locationreport", "adbannerreportid", "handlemethod", "reportlocation", "reportkhuvuc"
        FROM "reports"
        ORDER BY "reportlocation" ASC`
  );
  try {
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
      report.reportlocation.includes(req.user.districtUnit)
    );


    res.locals.places = await models.Place.findAll({
      attributes: [
        "id",
        "diaChi",
        "khuVuc",
        "loaiVT",
        "hinhThuc",
        "quyHoach",
        "hinhAnh",
      ],
      where: {
        khuVuc: {
          [Op.like]: `%${req.user.districtUnit}%`,
        },
      },
      order: [["createdAt", "DESC"]],
    });

    res.render("PHCB-Quan/report", {layout: "PHCB-Quan/layout"});
  } catch (error) {
    console.log("Error: ", error);
  }
};

controller.handleReport = async (req, res) => {
  let { id, handlemethodedit} = req.body;
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
