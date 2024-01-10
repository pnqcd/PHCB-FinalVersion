const controller = {};
const models = require("../../models");
const pool = require("../../database/database");

controller.show = (req, res)=>{
    res.render("PHCB-Phuong/homepage", {layout: "PHCB-Phuong/layout"});
};

controller.getPlace = (req, res) => {
    // let { ward, district } = req.query;
    let ward = req.user.wardUnit;
    let district = req.user.districtUnit;
    // console.log(ward);
    // console.log(district);
    pool.query(`select PL.*, COUNT(PLD.id) as adNumber
        from 	
            "Places" PL left join "Placedetails" PLD 
        on
            PLD."placeId" = PL.id 
        where 
            PL."khuVuc" LIKE $1
        and 
            PL."khuVuc" LIKE $2
        group by 
            PL.id,
            PL."diaChi",
            PL."khuVuc",
            PL."loaiVT",
            PL."hinhThuc",
            PL."hinhAnh",
            PL."hinhAnhId",
            PL."quyHoach",
            PL.longitude,
            PL.latitude,
            PL."createdAt",
            PL."updatedAt" `, [`${ward}%`, `%${district}`],
    (error, results) => {
        if (error) {
            res.status(500).json({ error });
            console.error(error);
        } else {
            res.json({ place: results.rows });
        }
    });
};

controller.getAdDetails = (req, res) => {
    const placeID = req.params.id;
    pool.query(
        `
        SELECT
            PL.*,
            PD.id AS adBannerId,
            PD."placeId",
            PD."adName",
            PD."adSize",
            PD."adQuantity",
            PD."expireDay",
            PD."imagePath",
            PD."publicImageId",
            PD."createdAt" AS adCreatedAt,
            PD."updatedAt" AS adUpdatedAt,
            RP.id as reportID,
            RP.lat,
            RP.lng,
            RP.reportername,
            RP.typeofreport,
            RP.reporteremail,
            RP.reporterphonenumber,
            RP.reportcontent,
            RP.imagepath1,
            RP.imagepath2,
            RP.locationreport,
            RP.adbannerreportid,
            RP.handlemethod,
            RP.reportlocation,
            RP.reportkhuvuc
        FROM "Places" PL
        JOIN "Placedetails" PD ON PL.id = PD."placeId"
        LEFT JOIN reports RP ON RP.adbannerreportid = PD.id
        WHERE PD."placeId" = 
        ` + placeID
        , (error, results) => {
            if (error) {
                res.status(500).json({ error });
                console.error("error")
            } else {
                res.json({ placeDetails: results.rows });
            }
        });
};

controller.getReport = (req, res) => {
    let ward = req.user.wardUnit;
    let district = req.user.districtUnit;
    pool.query(`select * from reports 
        where locationreport = true 
        and reportkhuvuc LIKE $1
        and reportkhuvuc LIKE $2`, [`${ward}%`, `%${district}`], (error, results) => {
            if (error) {
                res.status(500).json({ error });
                console.error("error")
            } else {
                res.json({ report: results.rows });
            }
    });
};

// route middleware to ensure user is logged in 
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