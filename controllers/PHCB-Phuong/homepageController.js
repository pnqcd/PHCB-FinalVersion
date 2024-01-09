const controller = {};
const models = require("../../models");
const pool = require("../../database/database");

controller.show = (req, res)=>{
    res.render("PHCB-Phuong/homepage", {layout: "PHCB-Phuong/layout"});
};

controller.getPlace = (req, res) => {
    // let { ward, district } = req.body;
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
            console.log("loi roi")
            console.error(error);
        } else {
            res.json({ place: results.rows });
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