const controller = {};
const models = require("../../models");
const pool = require("../../database/database");
const cheerio = require('cheerio');

controller.show = async (req, res) => {
    let result = await pool.query(`SELECT DISTINCT "districtName" FROM "Wards"`);
    res.locals.districts = result.rows;
    
    let locationCount = await pool.query(`SELECT COUNT(locationreport) FROM reports WHERE locationreport=true`);
    res.locals.locationReports = locationCount.rows[0].count;

    let adsCount = await pool.query(`SELECT COUNT(locationreport) FROM reports WHERE locationreport=false`);
    res.locals.adsReports = adsCount.rows[0].count;

    let reportResult = await pool.query(`SELECT * FROM reports`);
    let reports = reportResult.rows;
    reports.forEach(report => {
        const htmlString = report.reportcontent;
        const $ = cheerio.load(htmlString);
        const paragraphContent = $('p').text();
        
        report.reportcontent = paragraphContent;
    });
    res.locals.reports = reports;

    res.render("PHCB-So/statistic", {layout: "PHCB-So/layout"});
};

controller.getAllReports = async (req, res) => {
    // const { address } = req.query;
    // pool.query(`SELECT * FROM reports WHERE reportlocation LIKE '%${address}%'`, (error, results) => {
    //                 if (error) {
    //                     res.status(500).json({ error });
    //                     console.log("loi roi");
    //                     console.error(error);
    //                 } else {
    //                     res.json(results.rows);
    //                 }
    // });
    pool.query(`SELECT * FROM reports`, (error, results) => {
        if (error) {
            res.status(500).json({ error });
            console.log("loi roi");
            console.error(error);
        } else {
            res.json(results.rows);
        }
});
}

module.exports = controller;
